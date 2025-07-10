import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_DRIVER_APPLICATION,
  GET_DRIVER_APPLICATION,
  GET_DRIVER_APPLICATIONS,
  UPDATE_BACKGROUND_CHECK_STATUS,
} from "../lib/queries";

export const useDriverApplications = () => {
  return useQuery(GET_DRIVER_APPLICATIONS);
};

export const useDriverApplication = (id: string) => {
  return useQuery(GET_DRIVER_APPLICATION, {
    variables: { id },
    skip: !id,
  });
};

export const useCreateDriverApplication = () => {
  return useMutation(CREATE_DRIVER_APPLICATION, {
    refetchQueries: [{ query: GET_DRIVER_APPLICATIONS }],
  });
};

export const useUpdateBackgroundCheckStatus = () => {
  return useMutation(UPDATE_BACKGROUND_CHECK_STATUS, {
    refetchQueries: [{ query: GET_DRIVER_APPLICATIONS }],
  });
};
