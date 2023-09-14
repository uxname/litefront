import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const getRandomBackgroundImage = (): string => {
  const images = ['https://source.unsplash.com/random/1280x720?night'];
  const randomIndex = Math.floor(Math.random() * images.length);
  // eslint-disable-next-line security/detect-object-injection
  return images[randomIndex];
};

const SpotlightComponent = (): ReactElement => {
  const router = useRouter();
  const [radius, setRadius] = useState<number>(0);

  const MAX_RADIUS = 300;
  const RADIUS_COEFFICIENT = 200;
  const TWO = 2;
  const HUNDRED = 100;

  const onMouseMove = useCallback((event: MouseEvent) => {
    const spotlight = document.querySelector('.spotlight') as HTMLElement;
    if (spotlight && spotlight.offsetWidth) {
      const w = spotlight.offsetWidth;
      const h = spotlight.offsetHeight;
      const t = event.pageY - spotlight.offsetTop;
      const l = event.pageX - spotlight.offsetLeft;
      const dx = Math.abs(event.pageX - window.innerWidth / TWO);
      const dy = Math.abs(event.pageY - window.innerHeight / TWO);
      const distance = Math.hypot(dx, dy);

      // Set the radius of the gradient based on the distance from the center
      const newRadius =
        MAX_RADIUS -
        (distance * RADIUS_COEFFICIENT) /
          Math.hypot(window.innerWidth, window.innerHeight);

      setRadius(newRadius);

      // Update the spotlight style
      spotlight.style.backgroundImage = `radial-gradient(circle at ${
        (l / w) * HUNDRED
      }% ${
        (t / h) * HUNDRED
      }%, transparent 80px, rgba(0, 0, 0, 0.99) ${newRadius}px)`;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    return (): void => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  return (
    <SpotlightWrap>
      <ContentWrap>
        <SpotlightLink>Page not found</SpotlightLink>
        <SpotlightDescription>
          Hmm, the page you were looking for doesn’t seem to exist anymore
        </SpotlightDescription>
        <ButtonErrorLink onClick={(): Promise<boolean> => router.push('/')}>
          Back to main page
        </ButtonErrorLink>
      </ContentWrap>
      <Spotlight className="spotlight" radius={radius} />
    </SpotlightWrap>
  );
};

const SpotlightWrap = styled.div`
  background: url(${getRandomBackgroundImage()}) no-repeat center center;
  background-size: cover;
  height: 100vh;
  position: relative;
`;

const SpotlightLink = styled.span`
  color: white;
  display: flex;

  align-items: center;
  text-shadow: 0 0 0.2em;
  text-decoration: none;
  font-size: 4em;
  filter: blur(1px);

  font-weight: bold;

  &:hover {
    color: #fff;
  }
`;

const SpotlightDescription = styled.span`
  color: white;
  font-size: 1em;
`;

const Spotlight = styled.div<{ radius: number }>`
  position: absolute;
  height: 100%;
  width: 100%;
  background-image: radial-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));
  ${({ radius }): string => `
    background-image: radial-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ${radius}px);
  `}
`;

const ButtonErrorLink = styled.button`
  background-color: white;
  border: none;
  color: black;
  padding: 16px 32px;
  text-align: center;
  font-size: 1em;
  margin: 16px;
  opacity: 0.9;
  transition: 0.3s;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    opacity: 1;
  }
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

export default SpotlightComponent;
