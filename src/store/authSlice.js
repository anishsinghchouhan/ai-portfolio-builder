// Simple reactive state store for Supabase Auth state

class AuthStore {
  constructor() {
    this.state = {
      user: null,
      session: null,
      isAuthenticated: false,
      hasCompletedOnboarding: localStorage.getItem("ai_portfolio_onboarding_completed") === "true",
      isLoading: true,
      pendingVerificationEmail: null,
      error: null,
    };
    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const authStore = new AuthStore();
export default authStore;
