import { useRecoilCallback, useRecoilValue } from 'recoil';

import { CurrentUser, currentUserState } from '@/auth/states/currentUserState';
import {
  CurrentWorkspace,
  currentWorkspaceState,
} from '@/auth/states/currentWorkspaceState';
import { calendarBookingPageIdState } from '@/client-config/states/calendarBookingPageIdState';
import { isDefined } from 'twenty-shared/utils';
import { OnboardingStatus } from '~/generated/graphql';

const getNextOnboardingStatus = (
  currentUser: CurrentUser | null,
  currentWorkspace: CurrentWorkspace | null,
  calendarBookingPageId: string | null,
) => {
  // Skip all onboarding steps and go directly to completed
  if (currentUser?.onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION) {
    return OnboardingStatus.COMPLETED;
  }

  if (currentUser?.onboardingStatus === OnboardingStatus.PROFILE_CREATION) {
    return OnboardingStatus.COMPLETED;
  }
  
  if (currentUser?.onboardingStatus === OnboardingStatus.SYNC_EMAIL) {
    return OnboardingStatus.COMPLETED;
  }
  
  if (currentUser?.onboardingStatus === OnboardingStatus.INVITE_TEAM) {
    return OnboardingStatus.COMPLETED;
  }
  
  if (currentUser?.onboardingStatus === OnboardingStatus.BOOK_ONBOARDING) {
    return OnboardingStatus.COMPLETED;
  }
  
  return OnboardingStatus.COMPLETED;
};

export const useSetNextOnboardingStatus = () => {
  const currentUser = useRecoilValue(currentUserState);
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const calendarBookingPageId = useRecoilValue(calendarBookingPageIdState);

  return useRecoilCallback(
    ({ set }) =>
      () => {
        const nextOnboardingStatus = getNextOnboardingStatus(
          currentUser,
          currentWorkspace,
          calendarBookingPageId,
        );
        set(currentUserState, (current) => {
          if (isDefined(current)) {
            return {
              ...current,
              onboardingStatus: nextOnboardingStatus,
            };
          }
          return current;
        });
      },
    [currentWorkspace, currentUser, calendarBookingPageId],
  );
};
