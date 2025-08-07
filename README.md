# START Project

The START project is a modern web application built for early detection of autism risk by non-specialist health workers in low-resource settings. This mobile-first, progressive web app (PWA) provides a modular, open-source platform for conducting various assessments.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **PWA Support**: Full offline capability with service workers
- **Deployment**: Supports both standard deployment and GitHub Pages

## Key Features

- 🔄 Multiple assessment types with retry capabilities
- 📱 Responsive design optimized for tablets and mobile devices
- 🔌 Offline-first architecture
- 🎯 Real-time data collection and analysis
- 🌐 Multi-language support
- 📊 Comprehensive data export functionality

## Field Study Results

Results from the field study in India using the app are available:

- [Autism Risk Detection in Low-Resource Settings](https://journals.sagepub.com/doi/10.1177/13623613231182801)
- [Individual Component Results 1](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0265587)
- [Individual Component Results 2](https://arxiv.org/abs/2111.04064)

## Project Overview

The initial phase of the project was supported by the [Medical Research Council UK](http://www.mrc.ac.uk) Global Challenge Research Fund and focused on India. The START platform combines parent reports and direct child assessments to detect autism risk in children aged 2-5 years.

## Integration with STREAM

START is now part of the [STREAM platform](https://research.reading.ac.uk/stream), which assesses different domains of neurodevelopment in children between the ages of 0 and 6 years in India and Malawi.

# START App Data Format

The data collected for the each task includes 3 attempts per assessment. Each assessment has a unique `assessment_id`, and a maximum of three attempts (`noOfAttempt` ≤ 3) is allowed. Each generated csv file contains the data of all three attempts depending on how many attempta has been made. The structure of the data is as follows:

## Notes

- Each attempt has its corresponding `timeLimit`, which by default is 3 min.
- Users can attempt the task a maximum of three times, and data is recorded separately for each attempt but stored in a single `csv` file.
- `attempt<attempt_number>_touchX` and other similar fields use `<attempt_number>` to represent attempt 1, 2, or 3 respectively.
- Assessment specific metrics will only be available in their respective assessment type.

## Common Data Metrics

These fields are shared across all tasks:

| Column Name                                 | Description                                                |
| ------------------------------------------- | ---------------------------------------------------------- |
| `assessment_id`                             | Unique id for the assessment type                          |
| `noOfAttempt`                               | Number of attempts made (max 3)                            |
| `attempt<attempt_number>_timeTaken`         | Time taken for the attempt                                 |
| `attempt<attempt_number>_timeLimit`         | Max time limit for the attempt                             |
| `attempt<attempt_number>_startTime`         | Start time for the attempt (Date with time)                |
| `attempt<attempt_number>_endTime`           | End time for the attempt (Date with time)                  |
| `attempt<attempt_number>_closedWithTimeout` | Indicates if the attempt closed due to timeout (`Boolean`) |
| `attempt<attempt_number>_closedMidWay`      | Indicates if the attempt was closed midway (`Boolean`)     |
| `attempt<attempt_number>_screenHeight`      | Device Screen height in pixel                              |
| `attempt<attempt_number>_screenWidth`       | Device Screen width in pixel                               |
| `attempt<attempt_number>_deviceType`        | Device Type                                                |
| `userID`                                    | Unique identifier for the user                             |
| `userDOB`                                   | Date of birth of the user                                  |
| `userGender`                                | Gender of the user                                         |

## Assessment Specific Data Metrics

Each task has additional specific fields required for different purposes:

### Motor Following Task

| Column Name                      | Description                 |
| -------------------------------- | --------------------------- |
| `assessment_id`                  | `MotorFollowingTask`        |
| `attempt<attempt_number>_touchX` | X coordinate of touch input |
| `attempt<attempt_number>_touchY` | Y coordinate of touch input |
| `attempt<attempt_number>_objX`   | X coordinate of object      |
| `attempt<attempt_number>_objY`   | Y coordinate of object      |

### Bubble Popping Task

| Column Name                             | Description                                                                |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `assessment_id`                         | BubblePoppingTask                                                          |
| `attempt<attempt_number>_ballCoord`     | Coordinates of the ball center at the time of pop (format `x-y` in pixel ) |
| `attempt<attempt_number>_mouseCoord`    | Coordinates of the touch pointer (format `x-y` in pixel )                  |
| `attempt<attempt_number>_colors`        | Colors of the bubbles popped                                               |
| `attempt<attempt_number>_bubblesPopped` | Number of bubbles popped (`Number`)                                        |
| `attempt<attempt_number>_bubblesTotal`  | Total number of bubbles (**6** by default)                                 |

### Button Task

| Column Name                                 | Description                                                      |
| ------------------------------------------- | ---------------------------------------------------------------- |
| `assessment_id`                             | ButtonTask                                                       |
| `attempt<attempt_number>_buttonClickedData` | Type of button clicked (**red** or **blue**)                     |
| `attempt<attempt_number>_redButton`         | Video type linked with red button (**social** or **nonsocial**)  |
| `attempt<attempt_number>_blueButton`        | Video type linked with blue button (**social** or **nonsocial**) |

### Wheel Task

| Column Name                            | Description                      |
| -------------------------------------- | -------------------------------- |
| `assessment_id`                        | WheelTask                        |
| `attempt<attempt_number>_gazeDistance` | Distance of user from the device |
| `attempt<attempt_number>_gazeTiming`   | Timing of gaze distance          |

### Synchrony Task

| Column Name                         | Description                       |
| ----------------------------------- | --------------------------------- |
| `assessment_id`                     | SynchronyTask                     |
| `attempt<attempt_number>_drumPress` | Timing when user presses the drum |
| `attempt<attempt_number>_stickHit`  | Timing when stick hits the drum   |

### Delayed Gratification Task

| Column Name     | Description              |
| --------------- | ------------------------ |
| `assessment_id` | DelayedGratificationTask |

### Preferential Looking Task

| Column Name                             | Description                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| `assessment_id`                         | PreferentialLookingTask                                     |
| `attempt<attempt_number>_gazeTiming`    | Timing of gaze movements (in `sec` with two decimal points) |
| `attempt<attempt_number>_gazeDirection` | Direction of gaze movement (**left** or **right**)          |
| `attempt<attempt_number>_gazeVidType`   | Type of video used for gaze tracking (social or non-social) |

# Development

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Manishyadav514/START.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── content/           # Content pages
│   ├── management/        # Management interface
│   ├── survey/           # Survey components
│   ├── task/             # Assessment tasks
│   └── testing/          # Testing utilities
├── components/           # Shared components
├── constants/            # Configuration constants
├── hooks/               # Custom React hooks
├── lib/                 # Core utilities
├── models/              # Data models
├── services/            # External service integrations
├── state/              # State management
└── utils/              # Helper utilities

public/                  # Static assets
├── audio/              # Audio files
├── gif/                # GIF animations
├── icons/              # App icons
├── image/              # Static images
├── model/              # ML models
├── svg/                # SVG assets
└── video/              # Video content
```

# Deployment

## Standard Deployment

The app can be built and deployed to any hosting platform that supports Next.js applications:

```bash
# Build the application
npm run build

# Start production server
npm start
```

## GitHub Pages Deployment

1. Configure base URL in `config.constant.ts`:

   ```ts
   export const BASE_URL = "/start";
   ```

2. Enable GitHub Pages settings:

   - Set `isGithub` flag to `true` in `next.config.mjs`
   - Update asset paths in `public/manifest.json`
   - Configure GitHub repository settings

3. Deploy:
   ```bash
   npm run deploy
   ```
