import React, { useEffect, useState, useCallback } from 'react';
import { useAcademicStore } from '../../store/useAcademicStore';
import { PPC_2023_SUBJECTS } from '../../data/curriculumPPC2023';

interface Point {
  x: number;
  y: number;
}

interface ConnectionEdge {
  id: string;
  sourceId: string;
  targetId: string;
  start: Point;
  end: Point;
  isPrerequisiteChain: boolean;
  isDependentChain: boolean;
  isHighlighted: boolean;
}

interface GraphConnectionsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const GraphConnections: React.FC<GraphConnectionsProps> = ({ containerRef }) => {
  const { 
    hoveredSubjectId, 
    focusedPrereqIds, 
    focusedDependentIds,
    showAllConnections 
  } = useAcademicStore();

  const [edges, setEdges] = useState<ConnectionEdge[]>([]);

  const calculateEdges = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;

    const newEdges: ConnectionEdge[] = [];

    // Collect all edges from PPC subjects
    PPC_2023_SUBJECTS.forEach((targetSubj) => {
      targetSubj.prerequisites.forEach((sourceId) => {
        const sourceEl = document.getElementById(`subject-card-${sourceId}`);
        const targetEl = document.getElementById(`subject-card-${targetSubj.id}`);

        if (sourceEl && targetEl) {
          const sRect = sourceEl.getBoundingClientRect();
          const tRect = targetEl.getBoundingClientRect();

          // Calculate start point: middle right of source card
          const start: Point = {
            x: sRect.right - containerRect.left + scrollLeft,
            y: sRect.top + sRect.height / 2 - containerRect.top + scrollTop,
          };

          // Calculate end point: middle left of target card
          const end: Point = {
            x: tRect.left - containerRect.left + scrollLeft,
            y: tRect.top + tRect.height / 2 - containerRect.top + scrollTop,
          };

          // Determine highlight status
          const isPrereqChain = 
            (targetSubj.id === hoveredSubjectId && focusedPrereqIds.has(sourceId)) ||
            (focusedPrereqIds.has(targetSubj.id) && focusedPrereqIds.has(sourceId));

          const isDepChain = 
            (sourceId === hoveredSubjectId && focusedDependentIds.has(targetSubj.id)) ||
            (focusedDependentIds.has(sourceId) && focusedDependentIds.has(targetSubj.id));

          const isDirectlyConnected = 
            hoveredSubjectId !== null && 
            (sourceId === hoveredSubjectId || targetSubj.id === hoveredSubjectId || isPrereqChain || isDepChain);

          // If showAllConnections is true or if edge is part of hover focus, render it
          if (showAllConnections || isDirectlyConnected) {
            newEdges.push({
              id: `${sourceId}->${targetSubj.id}`,
              sourceId,
              targetId: targetSubj.id,
              start,
              end,
              isPrerequisiteChain: isPrereqChain || targetSubj.id === hoveredSubjectId,
              isDependentChain: isDepChain || sourceId === hoveredSubjectId,
              isHighlighted: isDirectlyConnected,
            });
          }
        }
      });
    });

    setEdges(newEdges);
  }, [containerRef, hoveredSubjectId, focusedPrereqIds, focusedDependentIds, showAllConnections]);

  // Recalculate on hover, filter, scroll, or resize
  useEffect(() => {
    calculateEdges();

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      calculateEdges();
    };

    window.addEventListener('resize', calculateEdges);
    container.addEventListener('scroll', handleScroll);

    // Initial timeout to ensure cards have completed layout animation
    const timeout = setTimeout(calculateEdges, 100);

    return () => {
      window.removeEventListener('resize', calculateEdges);
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [calculateEdges, containerRef]);

  if (edges.length === 0) return null;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Prerequisite Arrow Marker (Amber) */}
        <marker
          id="arrow-prereq"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#F59E0B" />
        </marker>

        {/* Dependent Arrow Marker (Purple) */}
        <marker
          id="arrow-dep"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#9333EA" />
        </marker>

        {/* Subtle Arrow Marker */}
        <marker
          id="arrow-subtle"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" opacity="0.4" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const dx = Math.abs(edge.end.x - edge.start.x) * 0.5;
        const path = `M ${edge.start.x} ${edge.start.y} C ${edge.start.x + dx} ${edge.start.y}, ${edge.end.x - dx} ${edge.end.y}, ${edge.end.x} ${edge.end.y}`;

        if (edge.isHighlighted) {
          const isPrereq = edge.isPrerequisiteChain;
          const strokeColor = isPrereq ? '#F59E0B' : '#9333EA';
          const markerId = isPrereq ? 'url(#arrow-prereq)' : 'url(#arrow-dep)';

          return (
            <g key={edge.id}>
              {/* Outer Glow Path */}
              <path
                d={path}
                fill="none"
                stroke={strokeColor}
                strokeWidth="6"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
              {/* Core Sharp Path */}
              <path
                d={path}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeDasharray={isPrereq ? '6 3' : 'none'}
                markerEnd={markerId}
                className="transition-all duration-150"
              />
            </g>
          );
        }

        // Default subtle line when showAllConnections is enabled
        return (
          <path
            key={edge.id}
            d={path}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeOpacity="0.25"
            markerEnd="url(#arrow-subtle)"
          />
        );
      })}
    </svg>
  );
};
