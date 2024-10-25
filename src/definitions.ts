export interface SmartwatchApplicationPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
