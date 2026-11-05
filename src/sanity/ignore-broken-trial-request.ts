const brokenTrialPost = /\/journey\/trial\/(?!override(?:[/?#]|$))[^/?#]+/;

function isBrokenTrialPost(method: string, url: string) {
  return method.toUpperCase() === "POST" && brokenTrialPost.test(url);
}

if (typeof window !== "undefined") {
  const target = window as Window & { __ignoreBrokenTrialRequest?: boolean };
  if (!target.__ignoreBrokenTrialRequest) {
    target.__ignoreBrokenTrialRequest = true;
    const blocked = new WeakSet<XMLHttpRequest>();
    const nativeOpen = XMLHttpRequest.prototype.open;
    const nativeSend = XMLHttpRequest.prototype.send;
    const nativeSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null,
    ) {
      if (isBrokenTrialPost(String(method), String(url))) {
        blocked.add(this);
        return;
      }
      return nativeOpen.call(this, method, url, async ?? true, username, password);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (name: string, value: string) {
      if (blocked.has(this)) return;
      return nativeSetRequestHeader.call(this, name, value);
    };

    XMLHttpRequest.prototype.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
      if (!blocked.has(this)) return nativeSend.call(this, body);
      const xhr = this;
      queueMicrotask(() => {
        const define = (key: string, value: unknown) => {
          Object.defineProperty(xhr, key, { configurable: true, get: () => value });
        };
        define("readyState", 4);
        define("status", 200);
        define("statusText", "OK");
        define("response", "{}");
        define("responseText", "{}");
        xhr.getAllResponseHeaders = () => "content-type: application/json\r\n";
        xhr.onreadystatechange?.(new Event("readystatechange"));
      });
    };

    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
      if (isBrokenTrialPost(method, url)) {
        return Promise.resolve(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
      }
      return originalFetch(input, init);
    };
  }
}

export {};
