import "@/styles/globals.css";
import "animate.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster
        toastOptions={{
          position: "top-right",
          className: "",
          style: {
            "font-size": "14px",
          },
        }}
      />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}