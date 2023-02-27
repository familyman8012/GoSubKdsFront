import {
  PageInfo,
  SlidePageWrap,
  SubKdsContent,
  SubKdsWrap,
} from 'ComponentsFarm/styles/common';
import SubKdsHeader from 'ComponentsFarm/SubKdsHeader';
import Receipt from 'ComponentsFarm/Receipt';
import {ISubkdsListRes} from 'ApiFarm/interface/subkds';
import {useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {fetchSubKdsList} from 'ApiFarm/subkds';
import {useEffect, useState} from 'react';
import {Swiper as SwiperContainer, SwiperSlide} from 'swiper/react';
import {Swiper} from 'swiper/types';
import {Mousewheel} from 'swiper';
import 'swiper/css';
import SwiperSlideItem from 'ComponentsFarm/SwiperSlideItem';
import {authStore} from 'MobxFarm/store';
import {useHistory} from 'react-router-dom';

export const menu = [
  {idx: 1, areaName: 'AISTT'},
  {idx: 2, areaName: 'STATION'},
  {idx: 4, areaName: '튀김기'},
  {idx: 8, areaName: '음료'},
];

function Home() {
  const history = useHistory();
  const [infoStatus, setInfoStatus] = useState({
    ing: 0,
    wait: 0,
  });

  const [areaNumber, setAreaNumber] = useState(1);

  const Grid = 16;
  const [swiperRef, setSwiperRef] = useState<Swiper | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);

  //셋팅 값 가져오기
  useEffect(() => {
    if (!authStore.session) {
      return history.push('/');
    }
  }, [history]);

  // 영수증 리스트
  const {data, refetch, isFetching} = useQuery<ISubkdsListRes, AxiosError>(
    ['subKdsListData'],
    () =>
      fetchSubKdsList(areaNumber, {
        current_page_number: 1,
        per_page_number: 99,
      }),
    {
      //refetchInterval: 1000 * 60 * 15,
      refetchInterval: 1000 * 5,
      refetchIntervalInBackground: true,
    },
  );

  useEffect(() => {
    if (data) {
      setInfoStatus({
        ing: data.list.filter(el => el.process_start_date !== '').length,
        wait: data.list.filter(el => el.process_start_date === '').length,
      });
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [areaNumber]);

  return (
    <div>
      {data?.list ? (
        <SubKdsWrap>
          <SubKdsHeader
            swiperRef={swiperRef}
            infoStatus={infoStatus}
            areaNumber={areaNumber}
            setAreaNumber={setAreaNumber}
            totalCount={Math.ceil(Number(data?.list?.length) / Grid)}
          />

          <SubKdsContent>
            {data?.list?.length === 0 ? (
              <div className="noOrder">
                <div className="title">
                  <img src="/images/intro-title.png" alt="1인피자의 시작" />
                </div>
                <div className="logo">
                  <img src="/images/intro-logo.png" alt="GOPIZZA" />
                </div>
              </div>
            ) : (
              <SwiperContainer
                className="mySwiper"
                onSwiper={setSwiperRef}
                cssMode={true}
                mousewheel={true}
                onSlideChange={() => setSlideIdx(Number(swiperRef?.realIndex))}
                modules={[Mousewheel]}>
                {new Array(Math.ceil(Number(data?.list?.length) / Grid))
                  .fill(null)
                  .map((_, i) => (
                    <SwiperSlide key={i}>
                      <SwiperSlideItem
                        receiptsData={data?.list?.slice(
                          Grid * i,
                          Grid * (i + 1),
                        )}
                        areaNumber={areaNumber}
                      />
                    </SwiperSlide>
                  ))}
              </SwiperContainer>
            )}
          </SubKdsContent>
          {/* <PageInfo>
            {slideIdx + 1} / {Math.ceil(data?.list.length / Grid)}
          </PageInfo> */}
        </SubKdsWrap>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Home;
