export interface HeaderConfig {
    isVisible: boolean;
    service: string;
    serviceLink: string;
}

export interface BodyConfig {
    phaseBanner: PhaseBannerConfig;
}

export interface FooterConfig {
    isVisible: boolean;
    links: Link[];
}

export interface Link {
    label: string;
    target: string;
}

export interface PhaseBannerConfig {
    feedback: string;
    isVisible: boolean;
    phase: string;
}

export interface UserConfig {
    roles: string[];
}

export interface LayoutConfig {
    body: BodyConfig;
    countDownForSeconds: number;
    defaultTimeoutSeconds: number;
    header: HeaderConfig;
    footer: FooterConfig;
}
export interface AnalyticsConfig {
    tracker: string;
    userId: string;
}

export default interface Config {
    analytics?: AnalyticsConfig;
    csrf: string;
    layout: LayoutConfig;
    user?: UserConfig;
}
