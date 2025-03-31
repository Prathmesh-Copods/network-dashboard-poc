export interface HeaderDomain {
  id: string;
  name: string;
  services: number;
  critical: number;
}

export interface NetworkHeaderData {
  location: string;
  timeRange: string;
  utc: string;
  currentTime: string;
  date: string;
  timeOffset: number;
  baseServices: Record<string, number>;
  baseCritical: Record<string, number>;
  domains: HeaderDomain[];
}

export interface DomainData {
  domain_id: string;
  domain_name: string;
  domain_type: string;
  location: string;
  total_services: number;
  critical_services: number;
  timestamp: number;
  id: string;
}

export interface ServiceData {
  service_id: string;
  service_name: string;
  domain_id: string;
  status: "Critical" | "Warning" | "Normal";
  importance_score: number;
  criticality_score: number;
  health_percentage: number;
  resource_metric: number;
  resource_unit: string;
  alert_count: number;
  critical_alert_count: number;
  reliability_percentage: number;
  timestamp: number;
  mos_score: number | null;
  packet_loss: number;
  traffic_streams: number;
  degradation_percentage: number;
  application_type: string;
  vlan: string;
  codec: string | null;
  id: string;
}

export interface Database {
  networkHeader: NetworkHeaderData;
  domains: DomainData[];
  services: ServiceData[];
}