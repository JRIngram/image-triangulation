import styles from "./page.module.css";

import React from "react";
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
