"use client";

import { create } from "zustand";
import type { ViewId, UserState, ChatMessage } from "@/lib/types";
import { defaultUser } from "@/lib/data/users";

interface AppState {
  // Navigation
  currentView: ViewId;
  selectedLocationId: string | null;
  selectedEventId: string | null;
  exploreCategory: string | "all";
  searchQuery: string;
  viewStack: ViewId[]; // for back navigation

  // User
  user: UserState | null;
  isAuthenticated: boolean;
  toggleSaved: (locationId: string) => void;
  toggleWishlist: (locationId: string) => void;
  markVisited: (locationId: string) => void;
  attendEvent: (eventId: string) => void;

  // AstroGuide chat
  chatMessages: ChatMessage[];
  chatLoading: boolean;
  addChatMessage: (msg: ChatMessage) => void;
  setChatLoading: (b: boolean) => void;
  clearChat: () => void;

  // Mobile nav
  isMobileNavOpen: boolean;

  // Navigation actions
  navigate: (view: ViewId, opts?: { locationId?: string; eventId?: string; category?: string }) => void;
  goBack: () => void;
  setSearchQuery: (q: string) => void;
  setExploreCategory: (c: string | "all") => void;
  toggleMobileNav: () => void;
  setMobileNav: (b: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentView: "home",
  selectedLocationId: null,
  selectedEventId: null,
  exploreCategory: "all",
  searchQuery: "",
  viewStack: ["home"],
  user: defaultUser,
  isAuthenticated: true,
  chatMessages: [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello, explorer. I'm AstroGuide — your AI companion for the cosmos. Ask me anything: where to see the Milky Way this weekend, which telescope to buy, what constellations are visible tonight, or how to plan a 2-day stargazing trip. I'll tailor my answers to your location, the weather, and the sky tonight.",
      timestamp: new Date().toISOString(),
    },
  ],
  chatLoading: false,

  toggleSaved: (locationId) => {
    const u = get().user;
    if (!u) return;
    const has = u.saved.includes(locationId);
    set({
      user: {
        ...u,
        saved: has ? u.saved.filter((id) => id !== locationId) : [...u.saved, locationId],
      },
    });
  },

  toggleWishlist: (locationId) => {
    const u = get().user;
    if (!u) return;
    const has = u.wishlist.includes(locationId);
    set({
      user: {
        ...u,
        wishlist: has ? u.wishlist.filter((id) => id !== locationId) : [...u.wishlist, locationId],
      },
    });
  },

  markVisited: (locationId) => {
    const u = get().user;
    if (!u) return;
    if (u.visited.includes(locationId)) return;
    set({
      user: {
        ...u,
        visited: [...u.visited, locationId],
        journeyProgress: Math.min(100, u.journeyProgress + 6),
      },
    });
  },

  attendEvent: (eventId) => {
    const u = get().user;
    if (!u) return;
    if (u.attendedEvents.includes(eventId)) return;
    set({
      user: {
        ...u,
        attendedEvents: [...u.attendedEvents, eventId],
        journeyProgress: Math.min(100, u.journeyProgress + 4),
      },
    });
  },

  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatLoading: (b) => set({ chatLoading: b }),
  clearChat: () =>
    set({
      chatMessages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Conversation reset. What would you like to explore?",
          timestamp: new Date().toISOString(),
        },
      ],
    }),

  navigate: (view, opts) => {
    const s = get();
    set({
      currentView: view,
      selectedLocationId: opts?.locationId ?? null,
      selectedEventId: opts?.eventId ?? null,
      exploreCategory: opts?.category ?? s.exploreCategory,
      viewStack: [...s.viewStack, view],
      isMobileNavOpen: false,
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  goBack: () => {
    const stack = get().viewStack;
    if (stack.length <= 1) {
      set({ currentView: "home", viewStack: ["home"] });
      return;
    }
    const newStack = stack.slice(0, -1);
    const prev = newStack[newStack.length - 1];
    set({ currentView: prev, viewStack: newStack, selectedLocationId: null, selectedEventId: null });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setExploreCategory: (c) => set({ exploreCategory: c }),
  isMobileNavOpen: false,
  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
  setMobileNav: (b) => set({ isMobileNavOpen: b }),
}));
