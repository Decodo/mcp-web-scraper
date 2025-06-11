export type ScraperApiResponseData = {
  results: {
    content: string;
    headers: Record<string, string>;
    cookies: {}[];
    status_code: number;
    task_id: string;
    created_at: string;
    updated_at: string;
  }[];
};
