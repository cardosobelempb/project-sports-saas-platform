# Table Tennis Player Ranking System

## Main Methods by Entity, Use Case and Repository

This document organizes the main recommended methods for each system entity, following professional architecture standards based on:

- Clean Architecture
- Domain-Driven Design (DDD)
- SOLID principles
- Clean Code
- Separation of Concerns

---

# System Overview

The system is divided into the following modules:

- Players
- Categories
- Levels
- Seasons
- Matches
- Rankings
- Discipline
- Disciplinary Cases
- Penalties
- Events

---

# Suggested Project Structure

```txt
src/
 └── modules/
     ├── players/
     ├── categories/
     ├── levels/
     ├── seasons/
     ├── matches/
     ├── rankings/
     ├── discipline/
     └── events/
```

---

# 1. Entity: Player

## Responsibility

Represents an athlete registered in the league.

---

## Entity Methods

```ts
class Player {
  activate(): void;
  deactivate(): void;

  changeName(name: string): void;

  changeCategory(categoryId: string): void;

  changeLevel(levelId: string): void;

  validateAgeForCategory(): void;

  isActive(): boolean;
}
```

---

## Use Cases

```ts
class RegisterPlayerUseCase {
  execute(input: RegisterPlayerInput): Promise<Player>;
}

class UpdatePlayerUseCase {
  execute(input: UpdatePlayerInput): Promise<Player>;
}

class ChangePlayerLevelUseCase {
  execute(input: ChangePlayerLevelInput): Promise<void>;
}

class DeactivatePlayerUseCase {
  execute(playerId: string): Promise<void>;
}

class ListPlayersUseCase {
  execute(filters: ListPlayersFilters): Promise<Player[]>;
}
```

---

## Repository

```ts
interface PlayerRepository {
  create(player: Player): Promise<void>;

  update(player: Player): Promise<void>;

  findById(id: string): Promise<Player | null>;

  findByName(name: string): Promise<Player[]>;

  findAll(): Promise<Player[]>;

  findActivePlayers(): Promise<Player[]>;

  existsById(id: string): Promise<boolean>;
}
```

---

# 2. Entity: Category

## Responsibility

Represents player age divisions.

Examples:

- Under 09
- Under 11
- Under 13
- Under 15
- Under 18
- Adult
- Master 40
- Master 50

---

## Entity Methods

```ts
class Category {
  changeName(name: string): void;

  updateAgeRange(
    minimumAge: number,
    maximumAge: number,
  ): void;

  canPlayerParticipate(age: number): boolean;

  activate(): void;

  deactivate(): void;
}
```

---

## Use Cases

```ts
class CreateCategoryUseCase {
  execute(input: CreateCategoryInput): Promise<Category>;
}

class UpdateCategoryUseCase {
  execute(input: UpdateCategoryInput): Promise<Category>;
}

class ListCategoriesUseCase {
  execute(): Promise<Category[]>;
}

class DeactivateCategoryUseCase {
  execute(categoryId: string): Promise<void>;
}
```

---

## Repository

```ts
interface CategoryRepository {
  create(category: Category): Promise<void>;

  update(category: Category): Promise<void>;

  findById(id: string): Promise<Category | null>;

  findAll(): Promise<Category[]>;

  findActiveCategories(): Promise<Category[]>;

  existsByName(name: string): Promise<boolean>;
}
```

---

# 3. Entity: Level

## Responsibility

Represents the player's technical skill level.

---

## Entity Methods

```ts
class Level {
  changeName(name: string): void;

  changeOrder(order: number): void;

  activate(): void;

  deactivate(): void;

  isHigherThan(level: Level): boolean;

  isLowerThan(level: Level): boolean;
}
```

---

## Use Cases

```ts
class CreateLevelUseCase {
  execute(input: CreateLevelInput): Promise<Level>;
}

class UpdateLevelUseCase {
  execute(input: UpdateLevelInput): Promise<Level>;
}

class ListLevelsUseCase {
  execute(): Promise<Level[]>;
}

class DeactivateLevelUseCase {
  execute(levelId: string): Promise<void>;
}
```

---

## Repository

```ts
interface LevelRepository {
  create(level: Level): Promise<void>;

  update(level: Level): Promise<void>;

  findById(id: string): Promise<Level | null>;

  findAll(): Promise<Level[]>;

  findActiveLevels(): Promise<Level[]>;

  existsByName(name: string): Promise<boolean>;
}
```

---

# 4. Entity: Season

## Responsibility

Controls the competitive cycle of the league.

---

## Entity Methods

```ts
class Season {
  start(): void;

  finish(): void;

  cancel(): void;

  updatePeriod(
    startDate: Date,
    endDate: Date,
  ): void;

  isActive(): boolean;

  canRegisterMatch(matchDate: Date): boolean;
}
```

---

## Use Cases

```ts
class CreateSeasonUseCase {
  execute(input: CreateSeasonInput): Promise<Season>;
}

class StartSeasonUseCase {
  execute(seasonId: string): Promise<void>;
}

class FinishSeasonUseCase {
  execute(seasonId: string): Promise<void>;
}

class ListSeasonsUseCase {
  execute(): Promise<Season[]>;
}

class GetActiveSeasonUseCase {
  execute(): Promise<Season | null>;
}
```

---

## Repository

```ts
interface SeasonRepository {
  create(season: Season): Promise<void>;

  update(season: Season): Promise<void>;

  findById(id: string): Promise<Season | null>;

  findAll(): Promise<Season[]>;

  findActiveSeason(): Promise<Season | null>;

  existsActiveSeason(): Promise<boolean>;
}
```

---

# 5. Entity: Match

## Responsibility

Represents a game between two players.

---

## Entity Methods

```ts
class Match {
  registerResult(result: MatchResult): void;

  cancel(reason: string): void;

  confirm(): void;

  playerParticipated(playerId: string): boolean;

  getWinnerId(): string;

  getLoserId(): string;

  isWalkover(): boolean;

  isFinished(): boolean;
}
```

---

## Use Cases

```ts
class RegisterMatchUseCase {
  execute(input: RegisterMatchInput): Promise<Match>;
}

class ConfirmMatchResultUseCase {
  execute(matchId: string): Promise<void>;
}

class CancelMatchUseCase {
  execute(input: CancelMatchInput): Promise<void>;
}

class ListPlayerMatchesUseCase {
  execute(playerId: string): Promise<Match[]>;
}

class ListSeasonMatchesUseCase {
  execute(seasonId: string): Promise<Match[]>;
}
```

---

## Repository

```ts
interface MatchRepository {
  create(match: Match): Promise<void>;

  update(match: Match): Promise<void>;

  findById(id: string): Promise<Match | null>;

  findByPlayerId(playerId: string): Promise<Match[]>;

  findBySeasonId(seasonId: string): Promise<Match[]>;

  findFinishedBySeasonId(
    seasonId: string,
  ): Promise<Match[]>;
}
```

---

# 6. Entity: PlayerRanking

## Responsibility

Represents the player's ranking data inside a season.

---

## Entity Methods

```ts
class PlayerRanking {
  registerVictory(
    points: number,
    setDifference: number,
  ): void;

  registerDefeat(
    points: number,
    setDifference: number,
  ): void;

  applyPenalty(points: number): void;

  removePenalty(points: number): void;

  updatePosition(position: number): void;

  calculateWinRate(): number;

  canMoveUpLevel(): boolean;

  canMoveDownLevel(): boolean;
}
```

---

## Use Cases

```ts
class UpdateRankingAfterMatchUseCase {
  execute(matchId: string): Promise<void>;
}

class ApplyRankingPenaltyUseCase {
  execute(input: ApplyRankingPenaltyInput): Promise<void>;
}

class RecalculateSeasonRankingUseCase {
  execute(seasonId: string): Promise<void>;
}

class ListRankingByCategoryUseCase {
  execute(input: ListRankingInput): Promise<PlayerRanking[]>;
}

class GetPlayerRankingUseCase {
  execute(
    input: GetPlayerRankingInput,
  ): Promise<PlayerRanking | null>;
}
```

---

## Repository

```ts
interface PlayerRankingRepository {
  create(ranking: PlayerRanking): Promise<void>;

  update(ranking: PlayerRanking): Promise<void>;

  findById(id: string): Promise<PlayerRanking | null>;

  findByPlayerAndSeason(
    playerId: string,
    seasonId: string,
  ): Promise<PlayerRanking | null>;

  findBySeasonId(
    seasonId: string,
  ): Promise<PlayerRanking[]>;

  findByCategoryAndSeason(
    categoryId: string,
    seasonId: string,
  ): Promise<PlayerRanking[]>;

  bulkUpdate(
    rankings: PlayerRanking[],
  ): Promise<void>;
}
```

---

# 7. Aggregate Root: DisciplinaryCase

## Responsibility

Controls the disciplinary process.

---

## Entity Methods

```ts
class DisciplinaryCase {
  sendToReview(): void;

  addEvidence(evidence: Evidence): void;

  addStatement(statement: Statement): void;

  addWitness(witness: Witness): void;

  registerDecision(
    decision: DisciplinaryDecision,
  ): void;

  applyPenalty(penalty: Penalty): void;

  archive(reason: string): void;

  isClosed(): boolean;

  isConfirmed(): boolean;
}
```

---

## Use Cases

```ts
class RegisterDisciplinaryCaseUseCase {
  execute(
    input: RegisterDisciplinaryCaseInput,
  ): Promise<DisciplinaryCase>;
}

class SendCaseToReviewUseCase {
  execute(caseId: string): Promise<void>;
}

class AddEvidenceUseCase {
  execute(input: AddEvidenceInput): Promise<void>;
}

class RegisterDisciplinaryDecisionUseCase {
  execute(
    input: RegisterDecisionInput,
  ): Promise<void>;
}

class ApplyPenaltyUseCase {
  execute(input: ApplyPenaltyInput): Promise<void>;
}
```

---

## Repository

```ts
interface DisciplinaryCaseRepository {
  create(
    disciplinaryCase: DisciplinaryCase,
  ): Promise<void>;

  update(
    disciplinaryCase: DisciplinaryCase,
  ): Promise<void>;

  findById(
    id: string,
  ): Promise<DisciplinaryCase | null>;

  findByAccusedPlayerId(
    playerId: string,
  ): Promise<DisciplinaryCase[]>;

  findByStatus(
    status: DisciplinaryCaseStatus,
  ): Promise<DisciplinaryCase[]>;

  findBySeasonId(
    seasonId: string,
  ): Promise<DisciplinaryCase[]>;
}
```

---

# 8. Entity: Aggression

## Responsibility

Represents aggression details inside a disciplinary case.

---

## Entity Methods

```ts
class Aggression {
  changeDescription(description: string): void;

  changeSeverity(
    severity: AggressionSeverity,
  ): void;

  isSevere(): boolean;

  isCritical(): boolean;

  requiresMandatoryPenalty(): boolean;
}
```

---

# 9. Entity: Evidence

## Responsibility

Represents files and proofs related to a disciplinary case.

---

## Entity Methods

```ts
class Evidence {
  validateFile(): void;

  changeDescription(description: string): void;

  hasUrl(): boolean;

  wasSubmittedBy(userId: string): boolean;
}
```

---

# 10. Entity: Penalty

## Responsibility

Represents a punishment applied after a disciplinary decision.

---

## Entity Methods

```ts
class Penalty {
  apply(): void;

  cancel(reason: string): void;

  hasPointLoss(): boolean;

  hasSuspension(): boolean;

  isActive(): boolean;
}
```

---

# 11. Entity: DisciplinaryDecision

## Responsibility

Represents the official disciplinary decision.

---

## Entity Methods

```ts
class DisciplinaryDecision {
  confirmProceeding(): void;

  markAsDismissed(): void;

  updateJustification(
    justification: string,
  ): void;

  isProceeding(): boolean;
}
```

---

# 12. Entity: Event

## Responsibility

Represents tournaments, league rounds and competitions.

---

## Entity Methods

```ts
class Event {
  openRegistration(): void;

  closeRegistration(): void;

  start(): void;

  finish(): void;

  cancel(reason: string): void;

  addParticipant(playerId: string): void;

  removeParticipant(playerId: string): void;

  isOpenForRegistration(): boolean;
}
```

---

## Use Cases

```ts
class CreateEventUseCase {
  execute(input: CreateEventInput): Promise<Event>;
}

class RegisterPlayerToEventUseCase {
  execute(
    input: RegisterPlayerToEventInput,
  ): Promise<void>;
}

class RemovePlayerFromEventUseCase {
  execute(
    input: RemovePlayerFromEventInput,
  ): Promise<void>;
}

class FinishEventUseCase {
  execute(eventId: string): Promise<void>;
}

class ListEventsUseCase {
  execute(filters: ListEventsFilters): Promise<Event[]>;
}
```

---

## Repository

```ts
interface EventRepository {
  create(event: Event): Promise<void>;

  update(event: Event): Promise<void>;

  findById(id: string): Promise<Event | null>;

  findBySeasonId(
    seasonId: string,
  ): Promise<Event[]>;

  findOpenRegistrations(): Promise<Event[]>;

  findAll(): Promise<Event[]>;
}
```

---

# Main Aggregate Roots

```txt
Player
Category
Level
Season
Match
PlayerRanking
DisciplinaryCase
Event
```

---

# Internal Aggregate Entities

```txt
Aggression
Evidence
Statement
Witness
DisciplinaryDecision
Penalty
```

---

# Recommended Domain Events

```ts
MatchFinishedEvent

RankingUpdatedEvent

PenaltyAppliedEvent

PlayerLevelPromotedEvent

PlayerLevelDemotedEvent
```

---

# Professional Recommendations

## 1. Avoid creating repositories for every entity

Repositories should exist mainly for Aggregate Roots.

Correct:

```txt
DisciplinaryCaseRepository
PlayerRepository
MatchRepository
```

Usually unnecessary:

```txt
AggressionRepository
EvidenceRepository
PenaltyRepository
```

---

## 2. Use Cases should represent user actions

Good examples:

```txt
RegisterPlayerUseCase
RegisterMatchUseCase
ApplyPenaltyUseCase
UpdateRankingAfterMatchUseCase
```

Avoid generic names:

```txt
CreateUseCase
UpdateUseCase
ProcessUseCase
```

---

## 3. Entities must protect business rules

Example:

```ts
if (this.playerAId === this.playerBId) {
  throw new Error(
    'A player cannot play against themselves.',
  );
}
```

---

# Complexity Analysis

## Update one entity

```txt
O(1)
```

## Find entity by ID

Indexed database:

```txt
O(log n)
```

Without index:

```txt
O(n)
```

## Sort ranking

```txt
O(n log n)
```

## Apply ranking penalty

```txt
O(1)
```

## Recalculate full ranking

```txt
O(n log n)
```

---

# Final Architecture Summary

```txt
Player participates in Match.
Match generates Result.
Result updates PlayerRanking.
PlayerRanking belongs to a Season.
DisciplinaryCase may generate Penalty.
Penalty impacts PlayerRanking.
```
