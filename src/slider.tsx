import React, { useCallback, useState } from 'react';
import { range } from 'lodash-es';

type SliderFn = (x: number) => number;

export const linearSlider: SliderFn = (_x) => 0;
export const parabolicSlider: SliderFn = (x) => Math.pow(x, 2);

export type SliderProps = {
  onConfirm?: () => void;
  debug?: boolean;
  height?: number;
  fn?: SliderFn;
  initialX?: number;
  initialY?: number;
  maxX?: number;
};

export const Slider: React.FC<SliderProps> = ({
  fn,
  initialX,
  initialY,
  maxX,
  height,
  onConfirm,
  debug,
}) => {
  const [x, setX] = useState(initialX || 0);
  const [y, setY] = useState(fn ? fn(initialY || 0) : initialY || 0);
  const [moving, setMoving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const d = height || 200;
  const width = maxX ? maxX + d : 200;
  const xValues = range(0, maxX, 0.5);
  const coordinates = xValues.map((x) => [x, fn ? fn(x) : 0], 0.01);
  const maxY = Math.max(...coordinates.map((coord) => Math.abs(coord[1])));

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      if (!confirmed) {
        setMoving(true);
      }
      debug && console.log('onMouseDown', e.pageX, e.pageY);
    },
    [confirmed, debug]
  );

  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      setMoving(false);
      if (!confirmed && e.pageX - d / 2 < maxX + d) {
        setX(0);
        setY(fn ? fn(e.pageX) : 0);
      } else if (e.pageX + d / 2 >= maxX + d) {
        debug && console.log('Confirmed');
        setConfirmed(true);
        onConfirm && onConfirm();
      }
      debug && console.log('onMouseUp', e.pageX, e.pageY);
    },
    [confirmed, debug, fn, maxX, onConfirm]
  );

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      debug && console.log('onMouseMove', e.pageX, e.pageY);
      debug &&
        console.log(
          'Current pos: ',
          e.pageX - d / 2,
          fn ? fn(e.pageX - d / 2) : 0
        );
      if (moving) {
        if (!confirmed && e.pageX - d / 2 >= 0 && e.pageX + d / 2 < maxX + d) {
          setX(e.pageX - d / 2);
          setY(fn ? fn(e.pageX - d / 2) : 0);
        } else if (!confirmed && e.pageX + d / 2 >= maxX + d) {
          debug && console.log('Confirmed');
          setConfirmed(true);
          onConfirm && onConfirm();
        }
      }
    },
    [confirmed, debug, fn, maxX, moving, onConfirm]
  );

  const handleMouseLeave = useCallback(
    (e) => {
      e.preventDefault();
      if (!confirmed) {
        setMoving(false);
        setX(0);
        setY(fn ? fn(e.pageX) : 0);
      }
      debug && console.log('onMouseLeave', e.pageX, e.pageY);
    },
    [confirmed, debug, fn]
  );

  return (
    <div
      style={{
        position: 'relative',
        width: width + d,
        height: maxY < 2 * (d / 2) ? 2 * (d / 2) : maxY + d,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {coordinates.map((coord, i) => (
          <circle
            key={i}
            cx={coord[0] + d / 4}
            cy={coord[1] + d / 4}
            r={d / 4}
            stroke="transparent"
            fill="gray"
          />
        ))}
      </svg>
      <div
        style={{
          width: d / 2,
          height: d / 2,
          position: 'absolute',
          top: y,
          left: x,
          backgroundColor: 'red',
          borderRadius: '50%',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />
    </div>
  );
};
