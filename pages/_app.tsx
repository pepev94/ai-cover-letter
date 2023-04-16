import { AppProps } from "next/app";
import "../styles/globals.css";
import { IntlProvider } from "react-intl";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import Spanish from "../content/locales/es.json";
import English from "../content/locales/en.json";
import NavBar from "@/components/navBar";
import { ThemeProvider } from "@emotion/react";
import { MuiTheme } from "@/utils/theme";
import { CssBaseline } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import Contact from "@/components/Contact";
import store from "@/redux/store";
import BuySubscription from "@/components/shared/BuyTokensCta";
import Script from "next/script";

const App = ({ Component, pageProps }: AppProps) => {
  const { locale } = useRouter();
  let [shortLocale] = locale ? locale.split("-") : ["en"];
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const queryClient = new QueryClient();

  const messages = useMemo(() => {
    if (selectedLanguage !== "") {
      switch (selectedLanguage) {
        case "es":
          return Spanish;
        case "en":
          return English;
      }
    }
    switch (shortLocale) {
      case "es":
        return Spanish;
      case "en":
        return English;
    }
  }, [shortLocale, selectedLanguage]);

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-523FJV1DME"
        strategy="afterInteractive"
      />
      {/* <Script id="hot-jar" strategy="afterInteractive">
        {`
           (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3377353,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script> */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-523FJV1DME');
        `}
      </Script>
      <Script
        id="Adsense-id"
        data-ad-client="ca-pub-4371440587772222"
        async
        strategy="beforeInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      />
      {/* <Script id="twak.to" strategy="afterInteractive">
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/63efecbb4247f20fefe13470/1gpgj9fu8';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </Script> */}
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider session={pageProps.session}>
            <IntlProvider
              locale={selectedLanguage !== "" ? selectedLanguage : shortLocale}
              messages={messages}
              onError={() => null}
            >
              <ThemeProvider theme={MuiTheme}>
                <CssBaseline />
                <BuySubscription />
                <NavBar setSelectedLanguage={setSelectedLanguage} />
                <Component {...pageProps} />
                <Contact />
              </ThemeProvider>
            </IntlProvider>
          </SessionProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
};
export default App;
