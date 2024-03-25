declare module "express" {
  interface Request {
    renderReact: (filename: string, props: any) => void;
  }
}
