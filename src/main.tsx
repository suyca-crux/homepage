import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/index';
import MagniquakePage from './pages/magniquake/index';
import PreviewPage from './pages/magniquake/preview';
import NotFoundPage from './pages/NotFound';
import './styles/global.css';

// 色変換ライブラリ（culori）が重いので、このページだけ遅延ロードする
// エントリファイルなので Fast Refresh の対象外。export しなくて問題ない
// eslint-disable-next-line react-refresh/only-export-components
const ColorConverterPage = lazy(() => import('./pages/color-converter/index'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/magniquake" element={<MagniquakePage />} />
        <Route path="/magniquake/preview" element={<PreviewPage />} />
        <Route
          path="/color-converter"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center">
                  <p className="text-body animate-pulse text-neutral-600 dark:text-neutral-400">
                    読み込み中...
                  </p>
                </div>
              }
            >
              <ColorConverterPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
