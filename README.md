# alltime-club-sim.html
Web Verstion of all time sim
# All-Time Club Simulator

A single-page HTML + JavaScript football (soccer) simulator that pits legendary and modern club teams against each other in a 32-team tournament. It runs entirely in the browser – no build tools, no frameworks required.

## Features

- **32-team tournament** with:
  - 8 groups of 4
  - Group stage (round-robin, draws allowed)
  - Knockout rounds (Round of 16, Quarterfinals, Semifinals, Final)
  - **All knockout ties decided on penalties if still level**

- **All-time club squads**
  - Historic and modern clubs: Barcelona, Real Madrid, Milan, Bayern, Liverpool, Flamengo, Boca, Ajax, United, etc.
  - Each team has a full **11-player squad**:
    - 10 outfield players
    - 1 goalkeeper
    - Each with an individual rating and position (FW / MF / DF / GK)
  - Extra “generic” squad players are generated where needed to keep squads complete.

- **Match engine**
  - Goals generated with a Poisson model based on team strength and a “goal environment” slider.
  - Home advantage slider affects expected goals.
  - Goals and assists are distributed across players based on their ratings.
  - Player ratings per match factor in:
    - Quality
    - Goals and assists
    - Goals conceded (for defenders/keeper)
  - **Penalty shoot-outs** for:
    - Ties on aggregate after two-legged knockouts
    - Draws in the final
  - Penalty skill is influenced by team strength.

- **Authentic-feeling match summaries**
  - Each match summary comments on:
    - Scoreline and context (tight vs high-scoring)
    - Who “controlled” the game
    - Standout players
    - Penalty shoot-out drama when applicable

- **Detailed statistics**
  - Per-player stats tracked across the tournament:
    - Matches played
    - Goals
    - Assists
    - Average rating
    - Clean sheets (goalkeepers)
    - Goals against (goalkeepers)
  - Stats are consistent with actual scorelines: total goals in the match equal the sum of recorded scorers.

- **Awards & leaderboards**
  - **Awards tab** shows four global lists (from Game 1 to the final):
    - Top Goal Scorers (Golden Boot-style)
    - Top Assisters (playmakers)
    - Top Goalkeepers (clean sheets & goals against)
    - Best Overall Players (by rating, with goals/assists as tie-breakers)
  - **Dashboard tab**:
    - Compact table of top 15 players by rating
    - Visual “impact” bars combining rating, goals, and assists

- **Tournament summary**
  - **Summary tab** includes:
    - Total matches
    - Total goals
    - Average goals per match
    - Number of penalty shoot-outs
    - Biggest win (largest goal margin)
    - Highest-scoring match
    - **Best XI (Team of the Tournament)** in a 4–3–3:
      - 1 Goalkeeper (clean sheets + rating)
      - 4 Defenders
      - 3 Midfielders
      - 3 Forwards
    - Best XI chosen using a combined score:
      - Average rating
      - Goals
      - Assists

- **Exports**
  - Download **matches.csv**:
    - Round, leg, scoreline, penalties (if any), and human-readable summary
  - Download **players.csv**:
    - Player, team, position, matches, goals, assists, clean sheets, goals against, average rating

- **Manual match simulator**
  - Simulate a single match between any two teams
  - Uses the same match engine as the tournament
  - Produces a one-off summary (does not affect tournament stats)

- **Keyboard shortcuts**
  - `R` – Randomize groups and immediately simulate a full tournament
  - `S` – Run tournament (using current groups & sliders)

- **Visual design**
  - Dark, stadium-inspired background
  - Neon pitch green, sky blue, and scoreboard red accents
  - Compact panels and cards for matches, awards, and bracket view

---

## Getting Started

1. **Requirements**
   - Any modern browser (Chrome, Firefox, Edge, Safari)
   - A text editor (e.g., VS Code)

2. **Installation**
   - Save the HTML file as `alltime-club-sim.html` anywhere on your machine.

3. **Running the app**
   - Open the file in your browser:
     - Double-click `alltime-club-sim.html`, or
     - Right-click → *Open With* → your browser of choice

4. **Basic usage**
   - Use the **sliders** to adjust:
     - `Goal Environment` (lower = tighter, higher = wild scorelines)
     - `Home Advantage` (boost to home team’s expected goals)
   - Click **“Randomize Groups”** to draw clubs into 8 groups.
   - Click **“Run Tournament”** to simulate:
     - All group matches
     - Knockout rounds (with penalties when needed)
   - Navigate with tabs:
     - **Groups** – current group draw
     - **Matches** – full match list with summaries and featured players
     - **Awards** – top scorers, assisters, keepers, and best players
     - **Dashboard** – top 15 players with bar chart-style impact
     - **Manual** – run one-off head-to-head simulations
     - **Bracket** – full knockout bracket visual
     - **Summary** – tournament overview + Best XI

---

## Data Model & Logic

- **Teams**
  - Each team has:
    - `teamStrength` (overall quality)
    - A `players` array of 11 players
    - Each player has:
      - `name`
      - `quality` (used as weight in scoring & rating)
      - `position`: `"FW" | "MF" | "DF" | "GK"`
      - `isGK`: `true` or `false`
  - If only “star” players are defined for a team, additional players are generated to fill out the XI.

- **Match Simulation**
  1. Expected goals calculated via a Poisson-based model from:
     - team strengths
     - goal environment slider
     - home advantage slider
  2. Goals and assists:
     - Each goal is assigned to a random outfield player weighted by quality.
     - Assists are randomly assigned (with a separate chance) to another outfield player.
     - These per-match stats are added to tournament totals.
  3. Ratings:
     - Outfield: base rating from quality, boosted by goals/assists and penalized for goals conceded.
     - GK: base rating from quality, boosted for clean sheets, reduced for goals conceded.
  4. Knockouts:
     - Two-legged ties:
       - Aggregate score decides the winner.
       - If aggregate is tied, a full penalty shoot-out is simulated.
     - Final:
       - Single match.
       - If score is tied, decision is via penalties.

---

## Customization

You can tweak or extend the sim by editing the HTML file:

- **Add or adjust teams**
  - Modify the `DEFAULT_TEAMS` array.
  - Change `teamStrength` and `stars` for each club.

- **Change aesthetics**
  - Update CSS variables at the top:
    - `--bg`, `--panel`, `--accent`, `--accent2`, `--accent3`, `--text`, `--sub`.

- **Tune match realism**
  - Adjust goal/rating formulas in:
    - `simulateScore`
    - `simulateTeamPerformance`
    - `penaltyChance`
    - `makeSummary`

---

## Notes

- There is **no backend** and no external dependencies – everything runs in the browser.
- Saves are stored in `localStorage` under keys like `saveData`, `teams`, `favorites`, etc.
- Randomness is not strictly seeded; the “Seed” field is currently visual (for labeling runs or future expansion).

Enjoy rerunning history and arguing over which club side truly comes out on top 👟⚽