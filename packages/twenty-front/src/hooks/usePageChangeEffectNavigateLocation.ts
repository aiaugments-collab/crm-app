import { verifyEmailRedirectPathState } from '@/app/states/verifyEmailRedirectPathState';
import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { useDefaultHomePagePath } from '@/navigation/hooks/useDefaultHomePagePath';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { useOnboardingStatus } from '@/onboarding/hooks/useOnboardingStatus';
import { AppPath } from '@/types/AppPath';
import { SettingsPath } from '@/types/SettingsPath';
import { useIsWorkspaceActivationStatusEqualsTo } from '@/workspace/hooks/useIsWorkspaceActivationStatusEqualsTo';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isDefined } from 'twenty-shared/utils';
import { WorkspaceActivationStatus } from 'twenty-shared/workspace';
import { OnboardingStatus } from '~/generated/graphql';
import { isMatchingLocation } from '~/utils/isMatchingLocation';

export const usePageChangeEffectNavigateLocation = () => {
  const isLoggedIn = useIsLogged();
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();
  const onboardingStatus = useOnboardingStatus();
  const isWorkspaceSuspended = useIsWorkspaceActivationStatusEqualsTo(
    WorkspaceActivationStatus.SUSPENDED,
  );
  const { defaultHomePagePath } = useDefaultHomePagePath();
  const location = useLocation();

  const someMatchingLocationOf = (appPaths: AppPath[]): boolean =>
    appPaths.some((appPath) => isMatchingLocation(location, appPath));
  const onGoingUserCreationPaths = [
    AppPath.Invite,
    AppPath.SignInUp,
    AppPath.VerifyEmail,
    AppPath.Verify,
  ];
  const onboardingPaths = [
    AppPath.CreateWorkspace,
    AppPath.CreateProfile,
    AppPath.SyncEmails,
    AppPath.InviteTeam,
    AppPath.PlanRequired,
    AppPath.PlanRequiredSuccess,
    AppPath.BookCallDecision,
    AppPath.BookCall,
  ];

  const objectNamePlural = useParams().objectNamePlural ?? '';
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const objectMetadataItem = objectMetadataItems?.find(
    (objectMetadataItem) => objectMetadataItem.namePlural === objectNamePlural,
  );
  const verifyEmailRedirectPath = useRecoilValue(verifyEmailRedirectPathState);

  if (
    (!isLoggedIn || (isLoggedIn && !isOnAWorkspace)) &&
    !someMatchingLocationOf([
      ...onGoingUserCreationPaths,
      AppPath.ResetPassword,
    ])
  ) {
    return AppPath.SignInUp;
  }

  if (
    onboardingStatus === OnboardingStatus.PLAN_REQUIRED &&
    !someMatchingLocationOf([
      AppPath.PlanRequired,
      AppPath.PlanRequiredSuccess,
      AppPath.BookCall,
      AppPath.BookCallDecision,
    ])
  ) {
    if (
      isMatchingLocation(location, AppPath.VerifyEmail) &&
      isDefined(verifyEmailRedirectPath)
    ) {
      return verifyEmailRedirectPath;
    }
    return AppPath.PlanRequired;
  }

  if (isWorkspaceSuspended) {
    if (!isMatchingLocation(location, AppPath.SettingsCatchAll)) {
      return `${AppPath.SettingsCatchAll.replace('/*', '')}/${
        SettingsPath.Billing
      }`;
    }

    return;
  }

  if (
    onboardingStatus === OnboardingStatus.WORKSPACE_ACTIVATION &&
    !someMatchingLocationOf([
      AppPath.CreateWorkspace,
      AppPath.BookCallDecision,
      AppPath.BookCall,
    ])
  ) {
    return AppPath.CreateWorkspace;
  }

  // Bypass profile creation step - redirect directly to dashboard
  if (
    onboardingStatus === OnboardingStatus.PROFILE_CREATION
  ) {
    return defaultHomePagePath;
  }

  // Also redirect away from CreateProfile page if someone tries to access it directly
  if (isMatchingLocation(location, AppPath.CreateProfile)) {
    return defaultHomePagePath;
  }

  // Bypass sync email step - redirect directly to dashboard
  if (
    onboardingStatus === OnboardingStatus.SYNC_EMAIL
  ) {
    return defaultHomePagePath;
  }

  // Bypass invite team step - redirect directly to dashboard
  if (
    onboardingStatus === OnboardingStatus.INVITE_TEAM
  ) {
    return defaultHomePagePath;
  }

  // Bypass book onboarding step - redirect directly to dashboard
  if (
    onboardingStatus === OnboardingStatus.BOOK_ONBOARDING
  ) {
    return defaultHomePagePath;
  }

  if (
    onboardingStatus === OnboardingStatus.COMPLETED &&
    someMatchingLocationOf([...onboardingPaths, ...onGoingUserCreationPaths]) &&
    !isMatchingLocation(location, AppPath.ResetPassword) &&
    isLoggedIn
  ) {
    return defaultHomePagePath;
  }

  if (isMatchingLocation(location, AppPath.Index) && isLoggedIn) {
    return defaultHomePagePath;
  }

  if (
    isMatchingLocation(location, AppPath.RecordIndexPage) &&
    !isDefined(objectMetadataItem)
  ) {
    return AppPath.NotFound;
  }

  return;
};
