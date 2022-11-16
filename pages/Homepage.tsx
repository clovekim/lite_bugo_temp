import React, { useMemo } from 'react';
import { FC } from 'react';

import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { BugoRoomCard } from '../components/BugoRoomCard';

import { funeralHomeStateSelectorFamily } from 'src/biz/recoil';
import { Loading } from 'src/shared/components/Loading';

export const BugoFuneralHomeMainPage: FC = function BugoFuneralHomeMainPage() {
  const { funeralHomeId } = useParams();
  const funeralHomeState = useRecoilValue(
    funeralHomeStateSelectorFamily(funeralHomeId ?? ''),
  );
  const RoomsCardContainer = useMemo(() => {
    if (funeralHomeState.status === 'success' && funeralHomeState.data) {
      const funeralHome = funeralHomeState.data;
      return (
        <div className="grid grid-cols-room-card-container auto-rows-auto gap-8 w-full justify-center h-full items-center ">
          {funeralHomeState.data.rooms.map((item: any) => {
            return (
              <div className="room-card" key={item._id}>
                <BugoRoomCard room={item} funeralHome={funeralHome} />
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="w-full h-screen-10 center-box">
          <Loading />
        </div>
      );
    }
  }, [funeralHomeState]);

  return <>{RoomsCardContainer}</>;
};
