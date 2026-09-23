import type { Pref } from './types';

export function formatDateTime(dateString: string | Date) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${month}/${day} ${hour}:${minute.toString().padStart(2, '0')}`;
}

export function nowJSTTime() {
  const date = new Date();
  return new Date(date.getTime() + 9 * 60 * 60 * 1000);
}

export function groupByInt(prefs: Pref[]) {
  const result: Record<string, Record<string, string[]>> = {};

  prefs.forEach((pref) => {
    const prefName = pref.Name;

    pref.Area?.forEach((area) => {
      area.City?.forEach((city) => {
        const int = city.MaxInt;

        if (!result[int]) result[int] = {};
        if (!result[int][prefName]) result[int][prefName] = [];

        result[int][prefName].push(city.Name);
      });
    });
  });

  return result;
}
