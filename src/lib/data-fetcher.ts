import {
  useQuery,
  useQueryClient,
  type QueryClient,
  type QueryFunctionContext,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { type Unsubscribe as AuthUnsubscribe } from 'firebase/auth';
import { type Unsubscribe as FirestoreUnsubscribe } from 'firebase/firestore';

type Unsubscribe = AuthUnsubscribe | FirestoreUnsubscribe;
type SubscriptionFn<TQueryFnData, TError> = (
  onSuccess: (data: TQueryFnData | null) => void,
  onError: (data: TError | null) => void,
) => Unsubscribe;

function createSubscriptionQueryFn<TQueryFnData, TError>(
  queryClient: QueryClient,
  subscriptionFn: SubscriptionFn<TQueryFnData, TError>,
): (context: QueryFunctionContext) => Promise<TQueryFnData> {
  return async (context) => {
    let unsubscribe: Unsubscribe | undefined;
    let firstRun = true;

    return new Promise<TQueryFnData | null>((resolve, reject) => {
      unsubscribe = subscriptionFn(
        (data) => {
          if (firstRun) {
            firstRun = false;
            resolve(data);
          } else {
            queryClient.setQueryData(context.queryKey, data);
          }
        },
        (error) => {
          if (firstRun) {
            reject(error);
            firstRun = false;
          } else {
            queryClient.invalidateQueries(context.queryKey);
          }
        },
      );
    }).then((data) => {
      queryClient.getQueryCache().subscribe(({ type, query }) => {
        if (
          !!unsubscribe &&
          type === 'observerRemoved' &&
          query.getObserversCount() === 0
        ) {
          unsubscribe();
          unsubscribe = undefined;
          queryClient.invalidateQueries(context.queryKey);
        }
      });

      return data as TQueryFnData;
    });
  };
}
export function useCreateSubscriptionQuery<TQueryFnData, TError>(
  queryKey: QueryKey,
  subscriptionFn: SubscriptionFn<TQueryFnData, TError>,
  options?: Pick<UseQueryOptions, 'enabled'>,
) {
  const queryClient = useQueryClient();

  return useQuery<TQueryFnData, TError>(
    queryKey,
    createSubscriptionQueryFn<TQueryFnData, TError>(
      queryClient,
      subscriptionFn,
    ),
    {
      retry: false,
      staleTime: Infinity,
      ...options,
    },
  );
}
