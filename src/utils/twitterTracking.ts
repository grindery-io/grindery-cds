declare global {
  interface Window {
    twq?: (...args: any[]) => void;
  }
}

export const sendTwitterConversion = (eventId: string, params = {}) => {
  if (!window.twq) {
    console.error("sendTwitterConversion error: twq is undefined");
    return;
  }
  window.twq("event", eventId, params);
};
