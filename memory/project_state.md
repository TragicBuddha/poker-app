---
name: project-state
description: Current state of the poker-app v2 branch — what's built, what's next
metadata:
  type: project
---

Working on v2 branch of poker-app. This is a React Native / Expo app for running poker tournaments.

**Why:** Personal tournament app for "Eric's Monday Mayhem" — a weekly poker game. Building toward a full tournament management system.

**What's built so far:**
- Main screen with title "Eric's Monday Mayhem", sign-in form, and New Game button
- Blind timer (in TournamentModal) with: level display, countdown, Start/Pause/Resume/Next buttons, configurable level duration, auto-advance, break handling (10 min fixed, expires and waits), expo-speech voice announcements (1-min warning says "Blinds will go up in one minute", level change announces blinds), voice persisted via AsyncStorage
- Player sign-in: new players enter first/last name → saved to Firestore `players` collection
- Returning players list: real-time Firestore listener, alphabetical by lastName/firstName, tap to prefill sign-in form
- Firebase credentials in .env (git-ignored), using EXPO_PUBLIC_ prefix

**Firestore structure:**
- Collection: `players`
- Fields: firstName (string), lastName (string), chipStack (number, 25), isEliminated (boolean, false), finalPosition (number, null)

**Composite index needed:** lastName + firstName on players collection (Firestore will prompt with a link on first query)

**What's next (discussed but not built):**
- Player roster/standings view inside TournamentModal
- Chip stack updates during game
- Tournament tracking (totalPlayers, etc.)
- Web viewer for players (blind timer + standings via QR code)
- EAS Build for standalone app when ready

**How to apply:** Use this to understand current app structure and what features are already in place before suggesting or building new ones.
