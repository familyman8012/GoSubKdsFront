import { Route, useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "PagesFarm/Home";
import Login from "PagesFarm/Login";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { authStore } from "MobxFarm/store";

const App = () => {
  const history = useHistory();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
    queryCache: new QueryCache({
      onError: (e: any) => {
        console.error(e);
      },
    }),
  });

  useEffect(() => {
    authStore.init();
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-center" />
      <Route path="/" exact={true} component={Login} />
      <Route path="/home" exact={true} component={Home} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
