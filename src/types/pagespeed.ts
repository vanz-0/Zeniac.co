// PageSpeed Insights API Types
export interface PageSpeedMetrics {
    performanceScore: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
}

export interface PageSpeedResponse {
    lighthouseResult: {
        categories: {
            performance: {
                score: number;
            };
        };
        audits: {
            'first-contentful-paint': {
                displayValue: string;
                numericValue: number;
            };
            'largest-contentful-paint': {
                displayValue: string;
                numericValue: number;
            };
            'total-blocking-time': {
                displayValue: string;
                numericValue: number;
            };
            'cumulative-layout-shift': {
                displayValue: string;
                numericValue: number;
            };
            'speed-index': {
                displayValue: string;
                numericValue: number;
            };
        };
    };
}
