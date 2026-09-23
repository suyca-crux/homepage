import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { ArrowUpRight } from 'lucide-react';
import { Heading, Space, Text } from '@vipelar/ui';

const NotFoundPage: React.FC = () => {
  return (
    <Layout title="404">
      <section className="max-w-3xl">
        <Text size="sm" color="red" bold className="tracking-widest">
          404
        </Text>
        <Heading title="ページが見つかりません" />
        <Space />
        <Text color="gray">お探しのページは存在しないか、移動・削除された可能性があります。</Text>
        <Space size="xl" />

        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-h4 font-bold text-neutral-900 dark:text-neutral-50 hover:text-primary dark:hover:text-primary-400 transition-colors"
        >
          トップページへ戻る
          <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </section>
    </Layout>
  );
};

export default NotFoundPage;
