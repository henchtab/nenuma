// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      isAuthenticated: boolean;
    }
    interface PageData {
      topic?: string;
      result?: {
        list: CandlestickData[];
        latest: CandlestickData;
      };
    }
    interface PageState {
      activeTab?: string;
    }
    // interface Platform {}
  }
}

export {};
