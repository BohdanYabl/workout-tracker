# RepLog — Mobilny Tracker Treningowy

RepLog to mobilna aplikacja do śledzenia treningów siłowych i kalisteniki, zbudowana w React Native z użyciem Expo. Umożliwia tworzenie planów treningowych, rejestrowanie serii w czasie rzeczywistym oraz śledzenie postępów fizycznych.

---

## Spis treści

1. [Opis projektu](#opis-projektu)
2. [Technologie](#technologie)
3. [Wymagania wstępne](#wymagania-wstępne)
4. [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
5. [Zmienne środowiskowe](#zmienne-środowiskowe)
6. [Struktura projektu](#struktura-projektu)
7. [Funkcje natywne](#funkcje-natywne)

---

## Opis projektu

RepLog rozwiązuje typowy problem osób trenujących na siłowni — brak prostego narzędzia do rejestrowania postępów bez zbędnych komplikacji. Aplikacja skupia się na szybkim wprowadzaniu danych podczas treningu, gdy czas między seriami jest ograniczony.

### Główne funkcje

| Funkcja | Opis |
|---|---|
| **Biblioteka ćwiczeń** | Ponad 30 ćwiczeń z filtrami grupy mięśniowej i sprzętu, wyszukiwanie, ulubione |
| **Rutyny treningowe** | Tworzenie, edycja i usuwanie planów treningowych (np. Push Day, Leg Day) |
| **Aktywny trening** | Logowanie serii (ciężar + powtórzenia) w czasie rzeczywistym z minutnikiem |
| **Timer odpoczynku** | Odliczanie między seriami, powiadomienie push po zakończeniu |
| **Rekord osobisty** | Automatyczne wykrywanie PR (formuła Epleya 1RM), potwierdzenie haptyką |
| **Historia treningów** | Lista sesji pogrupowanych według daty, szczegółowy podgląd każdej |
| **Masa ciała** | Dziennik wagi z chronologicznymi wpisami |
| **Zdjęcia postępu** | Galeria zdjęć posortowana datą, dodawanie z aparatu lub galerii systemowej |
| **Tryb offline** | Rutyny i historia dostępne bez połączenia z internetem (cache AsyncStorage) |

---

## Technologie

| Technologia | Zastosowanie |
|---|---|
| **Expo SDK 56** (managed workflow) | Framework React Native |
| **TypeScript** (strict) | Język programowania |
| **Expo Router** | Nawigacja oparta na plikach (plik = ekran) |
| **NativeWind 4** | Stylizacja za pomocą klas Tailwind CSS |
| **Zustand** | Globalny stan aplikacji |
| **Supabase** | Baza danych PostgreSQL, uwierzytelnianie, Storage |
| **AsyncStorage** | Cache offline dla danych treningowych |
| **expo-secure-store** | Bezpieczne przechowywanie tokenów sesji |
| **expo-notifications** | Lokalne powiadomienia push |
| **expo-haptics** | Wibracje i informacja zwrotna haptyczna |
| **expo-image-picker** | Dostęp do aparatu i galerii systemowej |

---

## Wymagania wstępne

- **Node.js** w wersji 18 lub nowszej
- **npm** (dołączony do Node.js)
- **Expo Go** — aplikacja na telefon do testowania ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **Konto Supabase** — bezpłatny plan wystarczy ([supabase.com](https://supabase.com))

---

## Instalacja i uruchomienie

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/<twoj-login>/replog.git
cd replog
```

### 2. Zainstaluj zależności

```bash
npm install --legacy-peer-deps
```

> Flaga `--legacy-peer-deps` jest wymagana ze względu na konflikty peer dependencies między NativeWind 4 a pakietami Expo SDK 56.

### 3. Utwórz plik zmiennych środowiskowych

```bash
cp .env.example .env
```

Uzupełnij plik `.env` swoimi danymi z projektu Supabase (patrz sekcja poniżej).

### 4. Uruchom serwer deweloperski

```bash
npx expo start
```

Zeskanuj kod QR aplikacją Expo Go lub wciśnij:

- `i` — symulator iOS (wymaga macOS i Xcode)
- `a` — emulator Android (wymaga Android Studio)

---

## Zmienne środowiskowe

Utwórz plik `.env` w katalogu głównym projektu z następującą zawartością:

```env
EXPO_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=twoj-klucz-anon
```

Obie wartości znajdziesz w panelu Supabase: **Settings → API**.

> **Ważne:** Nigdy nie commituj pliku `.env` do repozytorium — zawiera dane dostępowe do backendu. Plik `.env` jest uwzględniony w `.gitignore`.

---

## Struktura projektu

```
replog/
│
├── app/                          # Ekrany (Expo Router)
│   ├── _layout.tsx               # Korzenny layout: auth, sieć, uprawnienia
│   ├── (auth)/                   # Ekrany logowania i rejestracji
│   ├── (tabs)/                   # Główne zakładki aplikacji
│   │   ├── index.tsx             # Dashboard (statystyki, streak)
│   │   ├── library.tsx           # Biblioteka ćwiczeń z filtrami
│   │   ├── routines.tsx          # Lista planów treningowych
│   │   └── progress.tsx          # Historia, masa ciała, zdjęcia
│   ├── exercise/[id].tsx         # Szczegóły ćwiczenia
│   ├── routine/                  # Tworzenie i edycja rutyn
│   ├── workout/                  # Aktywny trening i podsumowanie
│   └── profile.tsx               # Profil użytkownika i wylogowanie
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Komponenty bazowe: Button, Card, Input…
│   │   └── features/             # Komponenty złożone: ExerciseCard, RoutineListCard…
│   ├── store/                    # Zustand — globalny stan
│   │   ├── auth.store.ts
│   │   ├── active-workout.store.ts
│   │   ├── routines.store.ts
│   │   ├── workouts.store.ts
│   │   ├── settings.store.ts
│   │   ├── exercises.store.ts
│   │   ├── body-weight.store.ts
│   │   └── network.store.ts
│   ├── services/                 # Komunikacja z Supabase i API urządzenia
│   │   ├── supabase.ts
│   │   ├── auth.service.ts
│   │   ├── notifications.service.ts
│   │   ├── haptics.service.ts
│   │   └── network.service.ts
│   ├── types/index.ts            # Wszystkie interfejsy TypeScript
│   ├── constants/theme.ts        # Kolory, rozmiary czcionek, odstępy
│   ├── data/exercises.ts         # Statyczna biblioteka ćwiczeń (lokalna, offline)
│   └── utils/                   # Funkcje pomocnicze: calculateVolume, formatDuration…
│
├── .env                          # Zmienne środowiskowe (nie commitować)
├── .env.example                  # Szablon zmiennych środowiskowych
├── app.json                      # Konfiguracja Expo
├── tailwind.config.js            # Konfiguracja NativeWind
└── tsconfig.json                 # TypeScript strict mode
```

---

## Funkcje natywne

Aplikacja korzysta z trzech kategorii funkcji sprzętowych urządzenia.

### Powiadomienia lokalne

Timer odpoczynku planuje powiadomienie push po zakończeniu odliczania. Powiadomienie jest dostarczane nawet gdy aplikacja jest zminimalizowana lub ekran jest wyłączony. Przy ręcznym pominięciu timera zaplanowane powiadomienie jest natychmiast anulowane.

### Wibracje i haptyka

| Zdarzenie | Typ wibracji |
|---|---|
| Ukończenie serii | Uderzenie średnie (`mediumImpact`) |
| Wykrycie rekordu osobistego | Powiadomienie sukcesu (`successNotification`) |
| Koniec timera odpoczynku | Powiadomienie ostrzegawcze (`warningNotification`) |
| Pominięcie timera | Lekkie uderzenie (`lightImpact`) |

### Aparat i galeria

Zdjęcia postępu można dodać z aparatu lub galerii systemowej. Plik jest wczytywany lokalnie, a następnie przesyłany do bucketu Supabase Storage. Uprawnienia do aparatu i galerii są wymagane jawnie — w przypadku odmowy aplikacja wyświetla stosowny komunikat i kontynuuje działanie.
