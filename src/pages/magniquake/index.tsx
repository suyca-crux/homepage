import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { Head, Body, IntList } from '@/lib/magniquake/Display';
import { GetPostData } from '@/lib/magniquake/getData';
import { ExternalLinkIcon } from 'lucide-react';
import type { Data } from '@/lib/magniquake/types';

const MagniquakePage: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetPostData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <Layout title="Magniquake">
      {loading ? (
        <div className="flex items-center justify-center min-h-100">
          <p className="text-body animate-pulse text-neutral-600 dark:text-neutral-400">
            読み込み中...
          </p>
        </div>
      ) : data ? (
        <div className="w-full">
          <div className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-6 transition-colors">
            <Link
              to="/"
              className="text-primary dark:text-primary-400 hover:underline text-caption mb-4 inline-block font-medium"
            >
              &larr; Vipelar's toy box
            </Link>
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
              <Head data={data.Head} />
              <p className="text-neutral-500 dark:text-neutral-400 text-caption tabular-nums">
                Event ID: {data.Head.EventID}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start mb-12">
            <div className="lg:col-span-1 space-y-6">
              <Body data={data.Body} />
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-caption font-bold text-primary dark:text-primary-400 uppercase tracking-wider mb-6">
                各地の震度
              </h2>
              <IntList data={data} />
            </div>
          </div>

          <div className="text-center py-8 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
            <a
              href="https://ntool.online/apidoc/earthquakeapi"
              className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:text-primary-400 hover:opacity-100 text-caption inline-flex items-center gap-1 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Data Source: NTool Earthquake API
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-h3 font-bold text-danger">データの取得に失敗しました</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-body text-primary dark:text-primary-400 underline"
          >
            再試行
          </button>
        </div>
      )}
    </Layout>
  );
};

export default MagniquakePage;
