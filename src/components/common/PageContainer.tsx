import React from 'react';
import { Box, Breadcrumbs, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  breadcrumbs,
  action,
}) => {
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {breadcrumbs && (
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Home
            </Link>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return isLast ? (
                <Typography color="text.primary" key={item.label}>
                  {item.label}
                </Typography>
              ) : (
                <Link
                  component={RouterLink}
                  to={item.link || '#'}
                  color="inherit"
                  key={item.label}
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            {title}
          </Typography>
          {action && <Box>{action}</Box>}
        </Box>
      </Box>

      {/* Content */}
      <Box>{children}</Box>
    </Box>
  );
};

export default PageContainer;