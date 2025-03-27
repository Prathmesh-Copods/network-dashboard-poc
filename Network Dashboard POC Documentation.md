# Network Dashboard POC

## Overview

This documentation outlines the architecture and data model for the Network Graph Dashboard, a monitoring dashboard proof-of-concept (POC) for visualizing and checking network domains and services across the organization.

## Tech Stack

The Network Dashboard POC is built using the following technologies:

### Frontend
- **Framework**: React.js with TypeScript
- **Visualization Library**: D3.js for all network and chart visualizations
- **State Management**: Redux for application state
- **Styling**: 
  - TailwindCSS for utility-first styling
  - Styled Components with SCSS for component-specific styling

### Backend
- **API Layer**: Mock API with static JSON data
- **Data Format**: JSON for all data exchange
- **Data Source**: Static JSON files representing domain and service data
- **Mock Service**: JSON-Server for simulating API endpoints locally

## Domain Architecture

The network is organized into logical domains to group related services and infrastructure.

### Domain Types

The primary domain types visualized in the dashboard are:

*   User Access Domain
*   Application Domain
*   Infrastructure Domain
*   Security Domain

*(Note: These types correspond to the quadrants in the main polar chart)*

## Data Models

The following schemas define the structure of the data used by the dashboard.

### Domain Schema

Represents a logical grouping of services.

| Field                 | Type    | Description                                       | Example (from UI)        |
| :-------------------- | :------ | :------------------------------------------------ | :----------------------- |
| `domain_id`           | String  | Unique identifier for the domain                  | `enterprise-1`           |
| `domain_name`         | String  | Display name of the domain                        | "Domain Enterprise"      |
| `domain_type`         | Enum    | Type of the domain (User Access, App, Infra, Sec) | `Application`            |
| `location`            | String  | Geographic or logical location                    | "CALIFORNIA"             |
| `total_services`      | Integer | Total number of services within the domain        | 120                      |
| `critical_services` | Integer | Count of services currently in a critical state   | 12                       |
| `timestamp`           | Integer | Unix timestamp of the last update                 | `1678886400`             |

### Service Schema

Represents an individual network service being monitored.

| Field                   | Type    | Description                                                                 | Example (from UI)         |
| :---------------------- | :------ | :-------------------------------------------------------------------------- | :------------------------ |
| `service_id`            | String  | Unique identifier for the service                                           | `svc-web-prod-01`         |
| `service_name`          | String  | Display name of the service                                                 | "Service Name dummy tex"  |
| `domain_id`             | String  | Identifier of the domain this service belongs to                            | `enterprise-1`            |
| `status`                | Enum    | Current health status ('Normal', 'Warning', 'Critical')                     | 'Critical'                |
| `importance_score`    | Float   | Metric determining radial position (distance from center) in the polar chart | `0.75` (e.g., 75% out)    |
| `criticality_score`   | Float   | Metric influencing size/visual weight in the polar chart                    | `0.8`                     |
| `health_percentage`   | Float   | Overall health or uptime percentage (0-100)                                 | 95.0                      |
| `resource_metric`     | Float   | Primary resource consumption metric value                                   | 12.5                      |
| `resource_unit`       | String  | Unit for the resource metric (e.g., 'K', 'Mbps', 'req/s')                   | "K"                       |
| `alert_count`         | Integer | Total number of active alerts for this service                              | 34                        |
| `critical_alert_count`| Integer | Number of critical alerts for this service                                  | 10                        |
| `reliability_percentage`| Float   | Service reliability metric (0-100)                                          | `99.9`                    |
| `timestamp`             | Integer | Unix timestamp of the last update                                           | `1678886400`              |
| `mos_score`             | Float   | Mean Opinion Score (for relevant services like VoIP)                        | 56.9                      |
| `packet_loss`         | Float   | Packet loss percentage (for relevant services)                              | 64.9                      |
| `traffic_streams`     | Integer | Number of active traffic streams (for relevant services)                    | 50000                     |
| `degradation_percentage`| Float   | Percentage of traffic experiencing degradation                              | 90.0                      |
| `application_type`    | String  | Type of application (e.g., Audio, Video, Data)                              | "Audio"                   |
| `vlan`                | String  | VLAN identifier, if applicable                                              | "Unknown"                 |
| `codec`               | String  | Codec used (for relevant services like VoIP)                                | "G.729"                   |

## Dashboard Components

### Main Network Dashboard (Image 1)

Provides a high-level overview of the entire monitored network landscape.

#### Domain-Based Network Polar Chart

*   **Description:** A central polar chart visualizing all monitored services.
*   **Service Plotting:** Services are plotted as points (circles). The distance from the center likely represents `importance_score`, while the size or intensity might relate to `criticality_score` or active alerts.
*   **Color-Coding:** Points are color-coded based on `status`:
    *   Green/Gray: Normal
    *   Yellow: Warning
    *   Red: Critical
*   **Quadrant Organization:** The chart is divided into quadrants, each potentially representing a `domain_type`. Icons (I, II, III, IV) likely map to specific domains listed at the top/bottom.

#### Critical Services Time-Series Display

*   **Description:** Dedicated radial gauges displaying near real-time status for the most critical services (e.g., top 6).
*   **Hourly Breakdown:** While labeled "1HR", the gauges show current status. The AM/PM markers on the 24-hour ring indicate the time of day, suggesting the data represents a snapshot within that context or potentially an aggregation over a recent period.
*   **Visualization:** Each gauge shows:
    *   `health_percentage` (e.g., 95%)
    *   `resource_metric` and `resource_unit` (e.g., 12.5 K)
    *   A visual representation of the percentage on the gauge face.
    *   AM/PM time context ring.
*   **Tracking:** Monitors key health metrics and resource consumption.

#### Other Service Status Cards

*   **Description:** Compact summary cards for specific domains or potentially less critical services, displayed below the main chart.
*   **Content:** Each card shows:
    *   Service/Domain Name
    *   Total `alert_count`
    *   `critical_alert_count`
    *   A small trend line, possibly indicating alert volume or health over a short period.
    *   Domain identifier icon (I, II, III, IV).

### Service-Specific Dashboard (Image 2)

Provides a detailed drill-down view for a specific service (e.g., "Web Service 2").

#### Network Traffic Impact Visualization

*   **Description:** Visualizes traffic flow originating from a specific source location (e.g., Denver) to multiple destinations.
*   **Flow Visualization:** Uses lines and nodes to represent traffic paths.
*   **Metrics:** Displays:
    *   Source location status (e.g., Denver, 56.9% MoS).
    *   Destination location status (e.g., Pune, 90% Deg).
    *   `traffic_streams` count for each path (e.g., 50k streams).
    *   Utilization/Degradation gauges or indicators per path (e.g., 96% degradation indicator for Pune path).
*   **Color-Coding:** Red indicators highlight significant degradation or impact.

#### Bidirectional Traffic Analysis

*   **Description:** Focuses on the network metrics between two specific locations (e.g., Denver to Pune).
*   **Metrics Display:** Shows key performance indicators for traffic in one or both directions:
    *   `mos_score` (e.g., 37% MoS, 54% MoS).
    *   `packet_loss` percentage (e.g., 64.9% PL, 25% PL).
    *   `traffic_streams` count (e.g., 50k streams, 8k streams).
    *   Impact percentage (e.g., -o 95% Impacted).
*   **Comparison:** Allows comparison of quality metrics for traffic flowing between the locations. Includes textual summary of impact.

#### Historical Traffic Analysis

*   **Description:** Presents historical network traffic statistics over time, typically between specific points (e.g., Denver > Pune).
*   **Visualization:** Uses a bar chart to show monthly statistics (e.g., volume, errors, latency - the specific metric isn't labeled but is plotted against months).
*   **Trend Identification:** Includes a trend line overlayed on the bars to identify patterns or changes over the selected period.
*   **Analysis:** Enables comparison of data points across time and potentially helps in anomaly detection by observing deviations from the trend.

## Example Data

### Sample Domain Instance (JSON)

```json
{
  "domain_id": "enterprise-1",
  "domain_name": "Domain Enterprise",
  "domain_type": "Application",
  "location": "CALIFORNIA",
  "total_services": 120,
  "critical_services": 12,
  "timestamp": 1400745600
}
```

### Sample Service Instance (JSON)
```json
{
  "service_id": "svc-dummy-tex-iv",
  "service_name": "Service Name dummy tex IV",
  "domain_id": "domain-3",
  "status": "Normal",
  "importance_score": 0.8,
  "criticality_score": 0.3,
  "health_percentage": 95.0,
  "resource_metric": 12.5,
  "resource_unit": "K",
  "alert_count": 18,
  "critical_alert_count": 9,
  "reliability_percentage": 99.95,
  "timestamp": 1400745900,
  "mos_score": null,
  "packet_loss": null,
  "traffic_streams": null,
  "degradation_percentage": null,
  "application_type": "Generic",
  "vlan": null,
  "codec": null
}
```