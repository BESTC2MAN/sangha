import { WallpaperItem } from '../types';

export const WALLPAPERS: WallpaperItem[] = [
  {
    id: 'iron_gym',
    title: 'FORGED IN IRON',
    subtitle: '평택 고덕 라이트짐 바벨 & 초크',
    theme: '웨이트 트레이닝',
    imagePath: '/src/assets/images/iron_gym_discipline_1792380579979.jpg',
    unlockedByDefault: true,
  },
  {
    id: 'iron_boxing',
    title: 'THE GRIT',
    subtitle: '한계를 뚫어내는 밴디지 & 글러브',
    theme: '복싱 & 격투기',
    imagePath: '/src/assets/images/iron_boxing_grit_1792380579899.jpg',
    unlockedByDefault: true,
  },
  {
    id: 'iron_running',
    title: 'NOCTURNAL STRIDE',
    subtitle: '비 내린 아스팔트 위 7km 야간 러닝',
    theme: '엔듀런스 러닝',
    imagePath: '/src/assets/images/iron_night_runner_1792380580776.jpg',
    unlockedByDefault: true,
  },
  {
    id: 'iron_champion',
    title: 'WEEKLY CHAMPION',
    subtitle: '주간 4회 올클리어 달성자 전용',
    theme: '빅토리 & 챔피언',
    imagePath: '/src/assets/images/iron_champion_finish_1792380580716.jpg',
    unlockedByDefault: false,
    unlockCondition: '주간 4회 목표 달성 시 자동 해금',
  },
];
