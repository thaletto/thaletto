'use client';

import React from 'react';
import { Timeline, TimelineItem } from './timeline';
import { motion } from 'framer-motion';
import type { TimelineElement } from '@/types';

interface TimelineLayoutProps {
  items: TimelineElement[];
  size?: 'sm' | 'md' | 'lg';
  iconColor?: 'primary' | 'secondary' | 'muted' | 'accent';
  customIcon?: React.ReactNode;
  animate?: boolean;
  connectorColor?: 'primary' | 'secondary' | 'muted' | 'accent';
  className?: string;
}

export const TimelineLayout = ({
  items,
  size = 'md',
  iconColor,
  customIcon,
  animate = true,
  connectorColor,
  className,
}: TimelineLayoutProps) => {
  const reversedItems = [...items].reverse();

  return (
    <Timeline className={className}>
      {reversedItems.map((item, index) => (
        <motion.div
          key={index}
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
        >
          <TimelineItem
            startDate={item.startDate}
            endDate={item.endDate}
            nextEndDate={reversedItems[index + 1]?.endDate}
            title={item.title}
            description={item.description}
            content={item.content}
            image={item.image}
            slug={item.slug}
            showConnector={index !== items.length - 1}
          />
        </motion.div>
      ))}
    </Timeline>
  );
};
