import React, { useMemo, useState } from 'react';
import { FC } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { BugoMessageSenderModal } from './BugoMessageSenderModal';

import { MessageSenderModal } from 'src/biz/components/MessageSenderModal';
import { endFevent } from 'src/biz/plugins/feventUtils';
import { FuneralHome, funeralHomeHookUrl, Room } from 'src/biz/recoil';
import { Button } from 'src/components/Button';
import { ErrorFallback } from 'src/components/ErrorFallback';
import { FitStringBox } from 'src/components/FitStringBox';
import { Icon } from 'src/components/icons';
import ModalConfirm from 'src/components/ModalConfirm';
import ModalDismiss from 'src/components/ModalDismiss';
import { PopUpLink } from 'src/components/PopUpLink';
import { Tooltip } from 'src/components/Tooltip';
import { coffinObjShortString } from 'src/plugins/dateUtils';
import { deceasedNameFormater } from 'src/plugins/feventStringFormater';
import { nameSexAgeString } from 'src/public/components/BoardDeceasedNameSexAge';
import { simpleOpenAtomFamily, useAuth } from 'src/recoil';

interface Props {
  room: Room;
  funeralHome: FuneralHome;
}

export const BugoRoomCard: FC<Props> = function BugoRoomCard({
  room,
  funeralHome,
}: Props) {
  const fullDeceasedName = useMemo(() => {
    if (room.feventCurrent) {
      const deceasedInfo = room.feventCurrent.deceasedInfo;
      return (
        <p className="bugo-h3 leading-6 whitespace-nowrap text-ellipsis overflow-hidden text-gray-700">
          {nameSexAgeString(
            deceasedInfo.name,
            deceasedInfo.sex,
            deceasedInfo.age,
            true,
            true,
            deceasedInfo.nameDetail,
          )}
        </p>
      );
    } else {
      return null;
    }
  }, [room.feventCurrent]);

  const openId = `bugoRoomCard-${room._id}`;
  const { dtoken } = useAuth();
  const queryClient = useQueryClient();
  const [endFeventOpen, setEndFeventOpen] = useState(false);
  const setMessageSenderOpen = useSetRecoilState(
    simpleOpenAtomFamily(`messageSender-${openId}`),
  );

  const coffinInString = useMemo(() => {
    const fevent = room.feventCurrent;
    if (fevent) {
      return coffinObjShortString(fevent.deceasedInfo.coffinIn);
    } else return null;
  }, [room.feventCurrent]);

  const coffinOutString = useMemo(() => {
    const fevent = room.feventCurrent;
    if (fevent) {
      return coffinObjShortString(fevent.deceasedInfo.coffinOut);
    } else return null;
  }, [room.feventCurrent]);

  const endFeventModal = useMemo(() => {
    if (room.feventCurrent) {
      return (
        <ModalDismiss
          open={endFeventOpen}
          setOpen={setEndFeventOpen}
          title="퇴실하시겠습니까?" /*  */
          subtitle={`${room.name} (${deceasedNameFormater(
            room.feventCurrent.deceasedInfo.name,
            false,
          )})`}
          buttonTitle="퇴실하기"
          onClick={async () => {
            await endFevent(room.feventCurrent._id, dtoken.role());
            queryClient.invalidateQueries(
              funeralHomeHookUrl(funeralHome._id, dtoken.role()),
            );
          }}
        />
      );
    }
  }, [
    dtoken,
    endFeventOpen,
    funeralHome._id,
    queryClient,
    room.feventCurrent,
    room.name,
  ]);

  const [courtesyOpen, setCourtesyOpen] = useState(false);
  const courtesyModal = useMemo(() => {
    return (
      <ModalConfirm
        open={courtesyOpen}
        setOpen={setCourtesyOpen}
        title="답례글 발송"
        subtitle="답례글 발송하시겠습니까? 답례글은 발인후 2시간 이후 자동 발송됩니다"
        buttonTitle="발송"
      ></ModalConfirm>
    );
  }, [courtesyOpen]);

  const roomCardContent = useMemo(() => {
    if (room.feventCurrent) {
      return (
        <div className="w-full h-full">
          <div className="w-full h-full">
            <div className="h-34">
              <div className="grid grid-rows-auto-1fr h-full">
                <div className="px-4 py-2 w-80">{fullDeceasedName}</div>
                <table className="font-medium border-collapse text-base sm:text-lg text-gray-700">
                  <tbody className="text-center">
                    <tr className="border border-x-0">
                      <td className="border w-1/4 border-l-0">입관</td>
                      <td className="border border-r-0 px-2">{coffinInString}</td>
                    </tr>
                    <tr className="border border-x-0">
                      <td className="border w-1/4 border-l-0">발인</td>
                      <td className="border border-r-0 px-2">{coffinOutString}</td>
                    </tr>
                    <tr className="border border-x-0">
                      <td className="border w-1/4 border-l-0">장지</td>
                      <td
                        className="border border-r-0 px-2"
                        style={{ maxWidth: '240px' }}
                      >
                        <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                          {room.feventCurrent.deceasedInfo.cemetery}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-2 h-34 mt-1 py-1">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
                <Link
                  to={`/bugo/funeral-home/${funeralHome._id}/fevent/${room.feventCurrent._id}/edit`}
                >
                  <Button className="h-full filled-white center-box gap-2 text-18 text-myTeal border-myTeal border-2 w-full">
                    <Icon.MoneyCheckPen className="wh-6 fill-myTeal" />
                    <p className="keep-all-preline">부고수정</p>
                  </Button>
                </Link>
                <Button
                  className="filled-myTeal text-white center-box gap-2 h-full text-18"
                  onClick={() => {
                    setMessageSenderOpen(true);
                  }}
                >
                  <Icon.MessageLines className="wh-6 fill-white" />
                  <p className="keep-all-preline">문자발송</p>
                </Button>
                <Button
                  className="h-full filled-white text-gray-700 center-box gap-2 border-2 border-gray-400 text-18"
                  onClick={() => {
                    setCourtesyOpen(true);
                  }}
                >
                  <Icon.EnvelopOpenText className="wh-6 fill-gray-700" />
                  답례글
                </Button>
                <Button
                  className="h-full filled-gray-200 text-gray-700 center-box gap-2 text-18"
                  onClick={() => {
                    setEndFeventOpen(true);
                  }}
                >
                  <Icon.MessageXmark className="wh-6 fill-gray-700" />
                  삭제
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full absolute bottom-0">
            <Link
              to={`fevent-past?roomId=${room._id}`}
              className="flex items-center justify-center bg-white border-t rounded-b-xl border-gray-300 p-4 h-16"
            >
              <div className="wh-10 center-box">
                <Icon.MagnifyingGlass className="wh-6 fill-gray-500" />
              </div>
              <span className="font-bold text-gray-500 keep-all-preline text-lg">
                과거부고 검색
              </span>
            </Link>
          </div>
          <BugoMessageSenderModal
            fevent={{
              ...room.feventCurrent,
              roomCurrent: room,
              funeralHome: funeralHome,
            }}
            openId={`messageSender-${openId}`}
          />
        </div>
      );
    } else {
      return (
        <div className="h-full flex flex-col gap-8 items-center justify-center text-20">
          <div className="w-full px-8">
            <Link
              to={`room/${room._id}/fevent/new`}
              className="flex items-center justify-center space-x-2 bg-myTeal p-4 rounded-xl shadow-gray-400 shadow-md hover:shadow-gray-400 hover:shadow-lg"
            >
              <div className="wh-16 center-box">
                <Icon.CirclePlus className="wh-14 fill-white" />
              </div>
              <span className="font-bold pr-8 text-white">부고 등록</span>
            </Link>
          </div>
          <div className="w-full px-8">
            <Link
              to={`fevent-past?roomId=${room._id}`}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-400 p-4 rounded-xl shadow-gray-400 shadow-md hover:shadow-gray-400 hover:shadow-lg"
            >
              <div className="wh-16 center-box">
                <Icon.MagnifyingGlass className="wh-12 fill-gray-500" />
              </div>
              <span className="font-bold text-gray-500 keep-all-preline">
                과거부고 검색
              </span>
            </Link>
          </div>
        </div>
      );
    }
  }, [
    coffinInString,
    coffinOutString,
    fullDeceasedName,
    funeralHome,
    openId,
    room,
    setMessageSenderOpen,
  ]);

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="drop-shadow-lg rounded-lg h-full bg-white">
          <div className="h-full">
            <div className="flex h-11 center-box justify-between rounded-t-lg">
              <h1
                className={`pl-3 biz-h3 text-white text-ellipsis overflow-hidden whitespace-nowrap bg-myTeal h-full flex items-center rounded-tl-lg ${
                  room.feventCurrent ? 'w-5/6' : 'w-full rounded-tr-lg'
                }`}
              >
                {room.name}
              </h1>
              {room.feventCurrent && (
                <div className="bg-gray-200 h-full rounded-tr-lg center-box w-1/6">
                  <PopUpLink
                    url={`/bugo/funeral-home/${funeralHome._id}/fevent/${room.feventCurrent._id}/obituary-message`}
                    width={480}
                    height={900}
                  >
                    <Tooltip title="부고보기">
                      <Icon.EyeSimple className="wh-6 fill-gray-700 cursor-pointer" />
                    </Tooltip>
                  </PopUpLink>
                </div>
              )}
            </div>
            <div className="h-86 relative">{roomCardContent}</div>
          </div>
        </div>
        {endFeventModal}
        {courtesyModal}
      </ErrorBoundary>
    </div>
  );
};
