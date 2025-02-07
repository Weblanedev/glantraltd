import brand_data from '@/data/brand-data';
import Link from 'next/link';
import React from 'react';

const LogoText = ({
  color = '#000',
  isUppercase = false,
}: {
  color?: string;
  isUppercase?: boolean;
}) => {
  return (
    <Link
      href="/"
      className="logo-bl"
      style={{
        fontSize: '24px',
        textTransform: isUppercase ? 'uppercase' : 'none',
        fontWeight: 'bold',
        color: color,
      }}
    >
      {brand_data.name}
    </Link>
  );
};

export default LogoText;
