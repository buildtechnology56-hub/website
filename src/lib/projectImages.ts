import commerceImg from '../assets/images/project_commerce_platform_1794626927448.jpg';
import erpImg from '../assets/images/project_enterprise_erp_1794626928582.jpg';
import marketingImg from '../assets/images/project_performance_marketing_1794626928031.jpg';
import brandingImg from '../assets/images/project_brand_identity_1794626929688.jpg';

const BUNDLED_IMAGE_MAP: Record<string, string> = {
  '/src/assets/images/project_commerce_platform_1794626927448.jpg': commerceImg,
  '/src/assets/images/project_enterprise_erp_1794626928582.jpg': erpImg,
  '/src/assets/images/project_performance_marketing_1794626928031.jpg': marketingImg,
  '/src/assets/images/project_brand_identity_1794626929688.jpg': brandingImg,
  'demo:commerce': commerceImg,
  'demo:erp': erpImg,
  'demo:marketing': marketingImg,
  'demo:branding': brandingImg,
};

export const DEMO_IMAGE_OPTIONS = [
  { label: 'Global E-Commerce Showcase', value: 'demo:commerce' },
  { label: 'Enterprise ERP & Operations', value: 'demo:erp' },
  { label: 'Performance Marketing Analytics', value: 'demo:marketing' },
  { label: 'Brand Identity System', value: 'demo:branding' },
];

export function resolveProjectImage(url: string): string {
  return BUNDLED_IMAGE_MAP[url] ?? url;
}
