import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Camera, Footprints, CheckCircle2, AlertCircle, RefreshCw, Upload, Sparkles } from 'lucide-react';
import { calculateDistanceMeters, formatDistance } from '../utils/geo';
import { VerificationType } from '../types';

export const VerifyTab: React.FC = () => {
  const {
    currentUser,
    squadConfig,
    verifyWorkout,
    setActiveTab,
  } = useApp();

  const [verifyMode, setVerifyMode] = useState<VerificationType>('gps');
  const [memo, setMemo] = useState('');
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // GPS state
  const [isLocating, setIsLocating] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Photo state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoTimestamp, setPhotoTimestamp] = useState<string>('');

  // Running state
  const [runDistance, setRunDistance] = useState<string>('7.2');
  const [runDuration, setRunDuration] = useState<string>('38');
  const [runRouteNote, setRunRouteNote] = useState<string>('고덕 수변공원 7.2km 서킷');

  // Request actual geolocation
  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('사용 중인 브라우저가 위치 정보를 지원하지 않습니다.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentCoords({ lat, lng });

        const dist = calculateDistanceMeters(
          lat,
          lng,
          squadConfig.gymLat,
          squadConfig.gymLng
        );
        setCalculatedDistance(dist);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGpsError('위치 권한을 허용해주세요. 또는 하단의 "라이트짐 현장 위치 시뮬레이션" 버튼을 사용하세요.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Simulate being right at the gym (e.g. 45 meters) for test purposes
  const handleSimulateAtGym = () => {
    const simulatedLat = squadConfig.gymLat + 0.0003;
    const simulatedLng = squadConfig.gymLng + 0.0002;
    setCurrentCoords({ lat: simulatedLat, lng: simulatedLng });
    const dist = calculateDistanceMeters(
      simulatedLat,
      simulatedLng,
      squadConfig.gymLat,
      squadConfig.gymLng
    );
    setCalculatedDistance(dist);
    setGpsError(null);
  };

  // Photo upload handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhoto(event.target?.result as string);
        setPhotoTimestamp(new Date().toLocaleString('ko-KR'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = () => {
    setSelectedPhoto('/src/assets/images/iron_gym_discipline_1792380579979.jpg');
    setPhotoTimestamp(new Date().toLocaleString('ko-KR'));
  };

  const distanceNum = parseFloat(runDistance) || 0;
  const durationNum = parseFloat(runDuration) || 0;
  let paceString = "0'00''";
  let averageSpeedKmh = 0;

  if (distanceNum > 0 && durationNum > 0) {
    const totalSeconds = durationNum * 60;
    const secPerKm = totalSeconds / distanceNum;
    const paceMin = Math.floor(secPerKm / 60);
    const paceSec = Math.floor(secPerKm % 60);
    paceString = `${paceMin}'${paceSec.toString().padStart(2, '0')}''`;
    averageSpeedKmh = Number(((distanceNum / (durationNum / 60))).toFixed(1));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (currentUser.hasAttendedToday) {
      setSubmitResult({
        success: false,
        message: '오늘은 이미 출석 인증을 완료하셨습니다. (하루 최대 1회 인정)',
      });
      return;
    }

    if (verifyMode === 'gps') {
      if (calculatedDistance === null) {
        setSubmitResult({
          success: false,
          message: '먼저 현재 위치를 확인해주세요.',
        });
        return;
      }

      if (calculatedDistance > squadConfig.targetRadiusMeters) {
        setSubmitResult({
          success: false,
          message: `지정 헬스장 반경(${formatDistance(
            squadConfig.targetRadiusMeters
          )})을 벗어났습니다. (현재 거리: ${formatDistance(calculatedDistance)})`,
        });
        return;
      }

      const res = verifyWorkout({
        type: 'gps',
        gymName: squadConfig.gymName,
        distanceToGymMeters: calculatedDistance,
        note: memo || 'GPS 현장 출석 확인',
      });
      setSubmitResult(res);
      if (res.success) {
        setTimeout(() => setActiveTab('home'), 1500);
      }
    } else if (verifyMode === 'photo') {
      if (!selectedPhoto) {
        setSubmitResult({
          success: false,
          message: '헬스장 현장 사진을 촬영하거나 업로드해주세요.',
        });
        return;
      }

      const res = verifyWorkout({
        type: 'photo',
        gymName: squadConfig.gymName,
        photoUrl: selectedPhoto,
        note: memo || '현장 사진 인증 완료',
      });
      setSubmitResult(res);
      if (res.success) {
        setTimeout(() => setActiveTab('home'), 1500);
      }
    } else if (verifyMode === 'run') {
      if (distanceNum < 7.0) {
        setSubmitResult({
          success: false,
          message: `러닝 인정 기준은 7.0km 이상입니다. (현재 ${distanceNum.toFixed(1)}km로 ${(
            7.0 - distanceNum
          ).toFixed(1)}km 부족)`,
        });
        return;
      }

      if (averageSpeedKmh > 25.0) {
        setSubmitResult({
          success: false,
          message: `비정상적인 이동 속도(${averageSpeedKmh}km/h)가 감지되었습니다. 차량 이동은 무효 처리됩니다.`,
        });
        return;
      }

      const res = verifyWorkout({
        type: 'run',
        runDistanceKm: distanceNum,
        runDurationMinutes: durationNum,
        runPace: paceString,
        note: memo || runRouteNote || `${distanceNum}km 완주`,
      });
      setSubmitResult(res);
      if (res.success) {
        setTimeout(() => setActiveTab('home'), 1500);
      }
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header Info */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] p-4 transition-all hover:border-white/20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-wider">
              MORE STRONG PEOPLE
            </span>
            <h2 className="font-['Oswald'] text-2xl font-bold tracking-wider text-slate-100 mt-0.5">
              운동 참석 인증
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-mono">출석 인정 기준</span>
            <span className="text-xs font-bold text-amber-400">하루 최대 1회</span>
          </div>
        </div>

        {currentUser.hasAttendedToday && (
          <div className="mt-3 p-3 bg-emerald-500/15 border border-emerald-400/30 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>오늘의 운동 인증이 이미 완료되었습니다! 내일 다시 도전하세요.</span>
          </div>
        )}
      </div>

      {/* Mode Selector (Segmented buttons) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setVerifyMode('gps');
            setSubmitResult(null);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            verifyMode === 'gps'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>GPS 헬스장</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setVerifyMode('photo');
            setSubmitResult(null);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            verifyMode === 'photo'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>사진 인증</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setVerifyMode('run');
            setSubmitResult(null);
          }}
          className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            verifyMode === 'run'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>7km+ 달리기</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* MODE A: GPS Gym Verification */}
        {verifyMode === 'gps' && (
          <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                지정 헬스장 위치 인증
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                지정된 헬스장({squadConfig.gymName}) 기준{' '}
                <span className="text-amber-400 font-semibold">반경 1km</span> 이내에서 인증 가능합니다.
              </p>
            </div>

            {/* Gym Info Card */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 text-xs space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">등록 헬스장</span>
                <span className="font-semibold text-slate-200">{squadConfig.gymName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="text-slate-400">위치</span>
                <span>{squadConfig.gymAddress}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span className="text-slate-400">좌표</span>
                <span>{squadConfig.gymLat.toFixed(4)}, {squadConfig.gymLng.toFixed(4)}</span>
              </div>
            </div>

            {/* Distance Feedback Display */}
            {calculatedDistance !== null && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  calculatedDistance <= squadConfig.targetRadiusMeters
                    ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-400/30 text-rose-300'
                }`}
              >
                <div>
                  <span className="block font-semibold">
                    {calculatedDistance <= squadConfig.targetRadiusMeters
                      ? '헬스장 반경 내 위치 확인 완료'
                      : '반경 1km 초과 (인증 불가)'}
                  </span>
                  <span className="text-[11px] opacity-80">
                    현재 헬스장과의 거리: {formatDistance(calculatedDistance)}
                  </span>
                </div>
                <span className="font-['Oswald'] text-lg font-bold tabular-nums">
                  {formatDistance(calculatedDistance)}
                </span>
              </div>
            )}

            {gpsError && (
              <div className="p-3 bg-amber-500/15 border border-amber-400/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>{gpsError}</span>
              </div>
            )}

            {/* Location Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="py-2.5 px-3 bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'GPS 위치 수신 중...' : '실제 현재 GPS 측정'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateAtGym}
                className="py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>라이트짐 현장 위치로 시뮬레이션</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE B: Photo Verification */}
        {verifyMode === 'photo' && (
          <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                헬스장 현장 사진 인증
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                헬스장 내부 기구 또는 현장 사진을 촬영하여 등록합니다. 촬영 시각이 워터마크로 기록됩니다.
              </p>
            </div>

            {selectedPhoto ? (
              <div className="relative rounded-xl overflow-hidden border border-white/20 bg-slate-950">
                <img
                  src={selectedPhoto}
                  alt="인증 사진 미리보기"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 font-mono flex items-center justify-between">
                  <span>[현장인증] {squadConfig.gymName}</span>
                  <span className="text-amber-400 font-bold">{photoTimestamp}</span>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-white/20 hover:border-white/40 rounded-xl p-6 text-center bg-slate-900/40">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">카메라로 현장 사진 촬영 또는 업로드</p>
                <p className="text-[11px] text-slate-500 mt-1">갤러리 재사용 방지를 위해 즉시 촬영을 권장합니다</p>
                <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-white/10 shadow-md">
                  <Upload className="w-3.5 h-3.5" />
                  <span>사진 선택하기</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUseSamplePhoto}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <span>라이트짐 샘플 사진 적용해보기</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE C: Running Verification (7km+) */}
        {verifyMode === 'run' && (
          <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-sky-400" />
                7km 이상 달리기 완주 인증
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                <span className="text-sky-400 font-semibold">7.0km 이상</span> 완주 기록은 헬스장 출석과 동일하게 1회로 공식 인정됩니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  러닝 거리 (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={runDistance}
                  onChange={(e) => setRunDistance(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-['Oswald'] text-lg font-bold tabular-nums focus:border-sky-500 focus:outline-none"
                  placeholder="7.0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  소요 시간 (분)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={runDuration}
                  onChange={(e) => setRunDuration(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-slate-100 font-['Oswald'] text-lg font-bold tabular-nums focus:border-sky-500 focus:outline-none"
                  placeholder="40"
                  required
                />
              </div>
            </div>

            {/* Calculated Metrics Card */}
            <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 flex items-center justify-around text-center text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">평균 페이스</span>
                <span className="font-['Oswald'] text-base font-bold text-sky-400 tabular-nums">
                  {paceString} /km
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">평균 시속</span>
                <span className="font-['Oswald'] text-base font-bold text-slate-200 tabular-nums">
                  {averageSpeedKmh} km/h
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">7km 달성 여부</span>
                <span
                  className={`font-semibold text-xs ${
                    distanceNum >= 7.0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {distanceNum >= 7.0 ? '조건 충족' : `${(7.0 - distanceNum).toFixed(1)}km 부족`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                러닝 코스 및 기록 출처
              </label>
              <input
                type="text"
                value={runRouteNote}
                onChange={(e) => setRunRouteNote(e.target.value)}
                placeholder="예: 고덕 수변공원 서킷, 나이키런 / 스트라바 연동"
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Workout Memo */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-950/45 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] p-4 transition-all hover:border-white/20">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            오늘의 운동 메모 (선택)
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 스쿼트 5세트 완료, 땀 제대로 뺐습니다!"
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Error / Success Message */}
        {submitResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              submitResult.success
                ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-400/30 text-rose-300'
            }`}
          >
            {submitResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{submitResult.message}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={currentUser.hasAttendedToday}
          className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98] ${
            currentUser.hasAttendedToday
              ? 'bg-slate-900/60 text-slate-500 cursor-not-allowed border border-white/10'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_4px_20px_rgba(245,158,11,0.4)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>{currentUser.hasAttendedToday ? '오늘 인증 완료됨' : '출석 인증 완료하기'}</span>
        </button>
      </form>
    </div>
  );
};
