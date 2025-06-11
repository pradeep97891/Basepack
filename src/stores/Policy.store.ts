import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  policies: any;
  openConditionModal: boolean;
  conditionsAndActions : any;
  reloadPolicyList : boolean;
  editablePolicy: any
}

const initialState: initialStateType = {
  policies: [],
  openConditionModal: false,
  conditionsAndActions: {},
  reloadPolicyList : false,
  editablePolicy: {}
};

const reducer = createSlice({
  name: "modal",
  initialState,
  reducers: {
    updatePolicies: (state, { payload }) => {
      state.policies = payload;
    },
    updateOpenConditionModal: (state, { payload }) => {
      state.openConditionModal = payload;
    },
    updateConditionsAndActions: (state, { payload }) => {
      state.conditionsAndActions = payload;
    },
    updateReloadPolicyList:(state) => {
      state.reloadPolicyList = !state.reloadPolicyList
    },
    updateEditablePolicy: (state , {payload}) => {
      state.editablePolicy = payload
    }
  },
});

export const {
  actions: { updatePolicies, updateOpenConditionModal, updateConditionsAndActions, updateReloadPolicyList, updateEditablePolicy },
  reducer: PolicyReducer,
} = reducer;
