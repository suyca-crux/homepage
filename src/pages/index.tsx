import React from 'react';
import Layout from '@/layouts/Layout';
import Card from '@/components/Card';
import { Heading } from '@vipelar/ui';
import { Activity } from 'lucide-react';

const PROJECTS = [
  {
    href: '/magniquake',
    icon: Activity,
    title: 'Magniquake',
    description:
      '気象庁発表の「震度速報」、「震源に関する情報」、「震源・震度に関する情報」、「遠地地震に関する情報」を自分好みの画面で見たくなりました。',
  },
];

const HomePage: React.FC = () => {
  return (
    <Layout title="Home">
      <div className="w-full max-w-3xl mx-auto">
        <Heading
          title="Vipelarのおもちゃ箱"
          subtitle="自分がほしいと思った小規模なWebアプリを作っている、気まぐれ開発室です"
        />
        <div className="mt-10 flex flex-col gap-4">
          {PROJECTS.map(({ href, icon, title, description }) => (
            <Card key={href} href={href} icon={icon} title={title} description={description} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
