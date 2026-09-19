import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as SolidIcons from '@heroicons/react/24/solid';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface AppIconProps {
  name: string;
  size?: number;
  className?: string;
  variant?: 'outline' | 'solid';
}

export default function Icon({ name, size = 20, className = '', variant = 'outline' }: AppIconProps) {
  const set = (variant === 'solid' ? SolidIcons : OutlineIcons) as unknown as Record<string, IconComponent>;
  const IconComponent = set[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent width={size} height={size} className={className} />;
}
