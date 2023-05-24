import { ReportErrorFrequency } from '@fuel-wallet/types';
import { useSelector } from '@xstate/react';
import { useEffect } from 'react';

import { type ReportErrorMachineState } from '../machines';

import { REPORT_ERROR_FREQUENCY_KEY } from '~/config';
import { Services, store } from '~/store';
import { useStorageItem } from '~/systems/Core/hooks/useStorage';

const selectors = {
  hasErrorsToReport(state: ReportErrorMachineState) {
    return state.context.hasErrors;
  },
  isLoadingSendOnce(state: ReportErrorMachineState) {
    return (
      state.hasTag('loading') &&
      state.context.frequency === ReportErrorFrequency.ONCE
    );
  },
  isLoadingSendAlways(state: ReportErrorMachineState) {
    return (
      state.hasTag('loading') &&
      state.context.frequency === ReportErrorFrequency.ALWAYS
    );
  },
  isLoadingDontSend(state: ReportErrorMachineState) {
    return (
      state.hasTag('loading') &&
      state.context.frequency === ReportErrorFrequency.DONT
    );
  },
  reportErrorSilently(state: ReportErrorMachineState) {
    return (
      state.context.hasErrors &&
      state.context.frequency === ReportErrorFrequency.ALWAYS
    );
  },
};

export function useReportError() {
  const [reportErrorFrequency, setReportErrorFrequency] =
    useStorageItem<ReportErrorFrequency>(
      REPORT_ERROR_FREQUENCY_KEY,
      ReportErrorFrequency.ONCE
    );
  const service = store.useService(Services.reportError);
  store.useUpdateMachineConfig(Services.reportError, {
    context: {
      frequency: reportErrorFrequency || ReportErrorFrequency.ONCE,
    },
    actions: {
      reload: () => {
        store.closeOverlay();
      },
    },
  });

  const hasErrorsToReport = useSelector(service, selectors.hasErrorsToReport);
  const isLoadingSendOnce = useSelector(service, selectors.isLoadingSendOnce);
  const isLoadingSendAlways = useSelector(
    service,
    selectors.isLoadingSendAlways
  );
  const isLoadingDontSend = useSelector(service, selectors.isLoadingDontSend);
  const reportErrorSilently = useSelector(
    service,
    selectors.reportErrorSilently
  );

  const reportErrorsOnce = () => {
    setReportErrorFrequency(ReportErrorFrequency.ONCE);
    service.send('REPORT_ERRORS', {
      input: { frequency: ReportErrorFrequency.ONCE },
    });
  };

  const alwaysReportErrors = () => {
    setReportErrorFrequency(ReportErrorFrequency.ALWAYS);
    service.send('REPORT_ERRORS', {
      input: { frequency: ReportErrorFrequency.ALWAYS },
    });
  };

  const dontReportErrors = () => {
    setReportErrorFrequency(ReportErrorFrequency.DONT);
    service.send('REPORT_ERRORS', {
      input: { frequency: ReportErrorFrequency.DONT },
    });
  };

  const close = () => {
    dontReportErrors();
  };

  useEffect(() => {
    // if it has errors, and user has chosen to report errors always, then report errors
    if (reportErrorSilently) {
      service.send('REPORT_ERRORS', {
        input: { frequency: ReportErrorFrequency.ALWAYS },
      });
    }
  }, [service, reportErrorSilently]);

  return {
    hasErrorsToReport,
    reportErrorSilently,
    isLoadingDontSend,
    isLoadingSendAlways,
    isLoadingSendOnce,
    store,
    handlers: {
      reportErrorsOnce,
      alwaysReportErrors,
      dontReportErrors,
      close,
    },
  };
}