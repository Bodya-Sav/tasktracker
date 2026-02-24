import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'preact/compat/client';

//import { queryClient } from "../api/client";
import App from './app.tsx'

import './index.css'

//import { QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
  //<QueryClientProvider client={queryClient}>
    <BrowserRouter basename="/tasktracker/">
      <App />
    </BrowserRouter>
  //</QueryClientProvider>
);
