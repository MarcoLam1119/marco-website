// src/components/Timeline.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import '../styles/timeline.scss';

export default function Timeline({ items = [], align = 'alternate' }) {
  const normalized = useMemo(() => {
    // Normalize and decide side for each item
    return items.reverse().map((it, i) => ({
      id: it.id ?? `${i}`,
      header: it.header ?? it.when ?? '',
      body: it.body ?? it.what ?? '',
      side:
        it.side ||
        (align === 'left' || align === 'right'
          ? align
          : i % 2 === 0
          ? 'left'
          : 'right'),
      color: it.color,
    }));
  }, [items, align]);

  return (
    <div className="timeline-chart">
      <div className="timeline-track" aria-hidden="true" />
      <div className="timeline-rows">
        {normalized.map((it) => (
          <div className={`tl-row ${it.side}`} key={it.id}>
            <div className="col left">
              {it.side === 'left' && (
                <Bubble header={it.header} body={it.body} color={it.color} />
              )}
            </div>
            <div className="col center">
              <div className={`arrow ${it.side}`} aria-hidden="true" />
            </div>
            <div className="col right">
              {it.side === 'right' && (
                <Bubble header={it.header} body={it.body} color={it.color} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bubble({ header, body, color }) {
  return (
    <div
      className="bubble"
      style={
        color
          ? {
              borderColor: color,
            }
          : undefined
      }
    >
      {header && <div className="bubble-header">{header}</div>}
      {body && (
        <div className="bubble-body">
          {String(body)
            .split(/\n+/)
            .map((line, i) => (
              <div key={i}>{line}</div>
            ))}
        </div>
      )}
    </div>
  );
}

Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      header: PropTypes.string,
      body: PropTypes.string,
      side: PropTypes.oneOf(['left', 'right']),
      color: PropTypes.string,
    })
  ),
  align: PropTypes.oneOf(['alternate', 'left', 'right']),
};

Bubble.propTypes = {
  header: PropTypes.string,
  body: PropTypes.string,
  color: PropTypes.string,
};