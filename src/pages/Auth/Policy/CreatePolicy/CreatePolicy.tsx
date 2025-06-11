import {
  Card,
  Col,
  Flex,
  Row,
  Tabs,
  TabsProps,
  Typography,
  Input,
  Button,
  Form,
  DatePicker,
  Switch,
  Select,
  message,
  FormProps,
  InputNumber,
  Tooltip,
  Space,
} from "antd";
import "./CreatePolicy.scss";
import { useTranslation } from "react-i18next";
import {
  useLazyGetPolicyCAQuery,
  usePutPolicyMutation,
} from "@/services/policy/Policy";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/hooks/App.hook";
import { updateReloadPolicyList } from "@/stores/Policy.store";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import Draggable from "@/components/Draggable/Draggable";
import Droppable from "@/components/Droppable/Droppable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import SubmitButton from "@/components/FormSubmitButton/FormSubmitButton";
import ConfirmModalPopup from "@/components/ConfirmModalPopup/ConfirmModalPopup";
import { usePostPolicyMutation } from "@/services/policy/Policy";
import { hydrateUserFromLocalStorage } from "@/Utils/user";
import CreatePolicySkeleton from "./CreatePolicy.skeleton";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import BreadcrumbComponent from "@/components/Breadcrumb/Breadcrumb";
import dayjs from "dayjs";
import DynamicForm from "@/components/DynamicForm/DynamicForm";
import { updateMessageApi } from "@/stores/General.store";
import { deepCompare, getDynamicDate } from "@/Utils/general";
import {
  useGetCreateScoreDataMutation,
  usePostScoreListDataMutation,
  usePutScoreListDataMutation,
} from "@/services/score/score.service";
import Toastr, { ToastrProps } from "@/components/Toastr/Toastr";
import { useRedirect } from "@/hooks/Redirect.hook";
import {
  useLazyGetAutoReassignPolicyCAQuery,
  usePostAutoReassignPolicyMutation,
  usePutAutoReassignPolicyMutation,
} from "@/services/autoReaccommodation/Policy";
import { useResize } from "@/Utils/resize";

const { Text } = Typography;

/**
 * CreatePolicy component displays a form page for creating policy conditions.
 * It allows users to create and provides information about policy conditions.
 */
const CreatePolicy: React.FC = () => {
  const CONDITION_FORM_KEY = "conditions";
  const ACTIONS_FORM_KEY = "actions";
  const CONDITION_DROPPABLE_ID = "policy-condition-droppable";
  const ACTION_DROPPABLE_ID = "policy-action-droppable";
  const DATE_PICKER_FORMAT = "MMM DD, YYYY";
  const DATE_TIME_FORMAT = "HH:mm";
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [getConditionsAndAction, policyCnADataResponse] =
    useLazyGetPolicyCAQuery();
  const [getScoreConditionsAndActions, scoreCnADataResponse] =
    useGetCreateScoreDataMutation();
  const [
    getAutoReassignConditionsAndAction,
    autoReassignPolicyCnADataResponse,
  ] = useLazyGetAutoReassignPolicyCAQuery();
  const [conditionsAndActions, setConditionsAndActions] = useState<any>({});
  const { currentPath, redirect, isCurrentPathEqual } = useRedirect();
  /* Browser storage state */
  const [SeditPolicy] = useSessionStorage<any>("editPolicy");
  /* Create policy service */
  const [createPolicy, createPolicyResponse] = usePostPolicyMutation();
  /* Update policy service */
  const [updatePolicy, updatePolicyResponse] = usePutPolicyMutation();
  /* Create score service */
  const [createScore, createScoreResponse] = usePostScoreListDataMutation();
  /* Update score service */
  const [updateScore, updateScoreResponse] = usePutScoreListDataMutation();
  /* Create policy service */
  const [createAutoReassignPolicy, createAutoReassignPolicyResponse] =
    usePostAutoReassignPolicyMutation();
  /* Update policy service */
  const [updateAutoReassignPolicy, updateAutoReassignPolicyResponse] =
    usePutAutoReassignPolicyMutation();
  /* Submitted policy value is stored in this state */
  const [policyFormValues, setPolicyFormValues] = useState<any>();
  /* Form object & states */
  const [createPolicyForm] = Form.useForm();
  /* This state is to used to store the status whether the user 
   made changes to the edit form values to enable subitting form.*/
  const [isValuesChanged, setIsValuesChanged] = useState<boolean>(false);
  /* Page states */
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>();
  /* Dragged condition or action data */
  const [activeDragData, setActiveDragData] = useState<any>();
  /* Boolean state to handle the display of actions dnd card */
  const [displayActions, setDisplayActions] = useState<boolean>(false);
  /* Dropped state value */
  const [droppedConditions, setDroppedConditions] = useState<any[]>([]);
  const [droppedActions, setDroppedActions] = useState<any[]>([]);
  const [scoreType, setScoreType] = useState<any>(
    SeditPolicy?.scoreType ? SeditPolicy?.scoreType : "Flight"
  );
  /* Policy status state */
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  /* Active tab name to control accepted draggables on droppables */
  const [activeDragTab, setActiveDragTab] = useState<string>(
    `${CONDITION_DROPPABLE_ID}-tab`
  );
  /* Filtering conditions and actions related states */
  const [filteredConditions, setFilteredConditions] = useState<any[]>([]);
  const [filteredActions, setFilteredActions] = useState<any[]>([]);
  /* To store criteria */
  const [criteria, setCriteria] = useState([]);
  const isScorePolicyPath: boolean =
    isCurrentPathEqual("createScorePolicy") ||
    isCurrentPathEqual("editScorePolicy");
  const formWatch = Form.useWatch([], createPolicyForm);

  /* Auto reaccommodation states */
  const isAutoReaccommodation: boolean = isCurrentPathEqual(
    "createAutoReaccommodationPolicy"
  );

  const { isSmallScreen } = useResize(2000);
  const {isMediumScreen} = useResize(992)

  function delayedReturn(initialResult: boolean, delay: number): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(initialResult);
      setTimeout(() => resolve(false), delay);
    });
  }

  /* Confirm modal popup data */
  const [popupData, setPopupData] = useState({
    modalName: "confirm",
    page: "createPolicy",
    header: t("sure?"),
    description: "",
    modalToggle: false,
    modalClass: "",
    modalWidth: 540,
    primaryBtn: { text: t("cancel"), value: false },
    secondaryBtn: { text: t("sure"), value: true },
    type: "default",
    loading: ()=>delayedReturn(true, 2000)
    // loading: SeditPolicy
    //   ? isScorePolicyPath
    //     ? isAutoReaccommodation
    //       ? updateAutoReassignPolicyResponse?.isLoading
    //       : updateScoreResponse?.isLoading
    //     : updatePolicyResponse?.isLoading
    //   : isScorePolicyPath
    //     ? createScoreResponse?.isLoading
    //     : isAutoReaccommodation
    //       ? createAutoReassignPolicyResponse?.isLoading
    //       : createPolicyResponse?.isLoading,
  });

  /* Service call to get policy conditions & actions */
  useEffect(() => {
    if (isScorePolicyPath) {
      getScoreConditionsAndActions([]);
    } else if (isAutoReaccommodation) {
      getAutoReassignConditionsAndAction([]);
    } else {
      getConditionsAndAction([]);
    }

    // eslint-disable-next-line
  }, []);

  /* Process & update condition & actions API response to states */
  useEffect(() => {
    if (
      isScorePolicyPath &&
      scoreCnADataResponse.isSuccess &&
      (scoreCnADataResponse?.data as any)?.responseCode === 0
    ) {
      setInitialData((scoreCnADataResponse?.data as any)?.response.data);
    } else if (
      isAutoReaccommodation &&
      autoReassignPolicyCnADataResponse.isSuccess &&
      (autoReassignPolicyCnADataResponse?.data as any)?.responseCode === 0
    ) {
      setInitialData(
        (autoReassignPolicyCnADataResponse?.data as any)?.response.data
      );
    } else if (
      policyCnADataResponse.isSuccess &&
      policyCnADataResponse.data?.responseCode === 0
    ) {
      {
        setInitialData(policyCnADataResponse?.data?.response.data);
      }
    }
    // eslint-disable-next-line
  }, [
    policyCnADataResponse,
    scoreCnADataResponse,
    autoReassignPolicyCnADataResponse,
  ]);

  useEffect(() => {
    if (scoreType && conditionsAndActions && isScorePolicyPath) {
      setFilteredActions(
        scoreType === "Flight"
          ? conditionsAndActions?.flightActions
          : conditionsAndActions?.paxActions
      );
    }
  }, [scoreType, conditionsAndActions]);

  const setDefaultConditionsAndAction = (cna: any) => {
    ["conditions", "actions"].forEach((k) => {
      const handler =
        k == "condition" ? setDroppedConditions : setDroppedActions;
      const defaults = cna?.[k]?.filter((coa: any) => coa.default);
      handler(defaults);
    });
  };

  const setInitialData = (data: any) => {
    setConditionsAndActions(data);
    setFilteredConditions(data.conditions);
    setFilteredActions(data.actions ? data.actions : data.flightActions);
  };

  /* EDIT FLOW : TO push the conditions & actions input generation values into droppedConditions/droppedActions
   to generate inputs dynamically so that values can be inserted for edit policy. */
  useEffect(() => {
    if (!conditionsAndActions) return;
    if (SeditPolicy) {
      // Show Actions defaultly for edit flow.
      setDisplayActions(true);
      // Load criteria values based on trigger value by default.
      getCriteria(SeditPolicy?.trigger);
      // Set status by default
      setIsEnabled(SeditPolicy?.status === "Active");
      let actions = !isScorePolicyPath
        ? ACTIONS_FORM_KEY
        : scoreType === "Flight"
          ? "flightActions"
          : "paxActions";

      [CONDITION_FORM_KEY, actions].forEach((droppableType: string) => {
        Object.keys(SeditPolicy?.[droppableType]).forEach((key: string) => {
          let selectedCondition = conditionsAndActions?.[droppableType]?.find(
            (condition: any) => {
              return condition.key === key;
            }
          );

          if (!selectedCondition) return;

          const updateHandler =
            droppableType === CONDITION_FORM_KEY
              ? setDroppedConditions
              : setDroppedActions;

          updateHandler((prevState) => [...prevState, selectedCondition]);
        });
      });
    } else {
      setDefaultConditionsAndAction(conditionsAndActions);
    }
  }, [SeditPolicy, conditionsAndActions]);

  /* Drag start Handler */
  const handleDragStart = useCallback(
    (e: DragStartEvent) => {
      const { id } = e.active;
      setActiveId(id);
      const tempConditionsOrActions =
        activeDragTab === `${CONDITION_DROPPABLE_ID}-tab`
          ? conditionsAndActions.conditions
          : conditionsAndActions.actions
            ? conditionsAndActions.actions
            : scoreType === "Flight"
              ? conditionsAndActions?.flightActions
              : conditionsAndActions?.paxActions;
      setActiveDragData(
        tempConditionsOrActions.filter(
          (condition: any) => condition.id === id
        )[0]
      );
    },
    [
      activeDragTab,
      conditionsAndActions.conditions,
      conditionsAndActions.actions
        ? conditionsAndActions.actions
        : scoreType === "Flight"
          ? conditionsAndActions?.flightActions
          : conditionsAndActions?.paxActions,
    ]
  );

  /**
   * Verifies if the action or condition has already been dropped.
   * If it is dropped, see if it can be replicated before dropping it once more.
   **/
  // eslint-disable-next-line
  const shouldConditionBeAdded = (isCondition: boolean = true) => {
    const dropped = isCondition ? droppedConditions : droppedActions;
    const isDropped = dropped && Object.keys(dropped).includes(activeDragData.key);
    return !isDropped || (isDropped && activeDragData.isCloneable);
  };

  /* This method is trigger at the end of each drag */
  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveId(null);
      const draggableId = e.active.id;
      /* The ID of the droppable container is this value. This value is undefined if the 
         draggable element is not dropped inside the droppable container. */
      const droppableId = e.over?.id;

      if (!droppableId || !draggableId) return;
      /* Method mapping of condition's and action's state updation to current droppable ID */
      const droppableHandlers: any = {
        [CONDITION_DROPPABLE_ID]: setDroppedConditions,
        [ACTION_DROPPABLE_ID]: setDroppedActions,
      };

      if (activeDragTab === `${droppableId}-tab`) {
        shouldConditionBeAdded(droppableId === CONDITION_DROPPABLE_ID)
          ? droppableHandlers[droppableId]((prevState: any[]) => {
              return prevState ? [...prevState, activeDragData] : [activeDragData];
            })
          : messageApi.error(`Cannot be cloned!`);
      } else {
        messageApi.error(
          `Oops! That item can't go there. Please try dragging it to the '${
            activeDragTab === `${CONDITION_DROPPABLE_ID}-tab` ? "IF" : "THEN"
          }' section.`
        );
      }
    },
    [activeDragTab, activeDragData, shouldConditionBeAdded, messageApi]
  );

  /* Draggable card element */
  const DragCard = memo((props: any) => (
    <Card
      className={`cls-drag-card ${
        props.dropped
          ? "cls-dropped"
          : !props.draggable
            ? "cls-dragged-out"
            : ""
      }`}
      key={props.data.id}
    >
      <Row align="middle" justify="space-between">
        <Col span={22}>
          <Text
            type="secondary"
            className={`${props.data.icon} mr-3 fs-24 cls-card-icon`}
          ></Text>
          <Text className="fs-15 cls-condition">{props.data?.name}</Text>
        </Col>
        <Col span={2}>
          <Text
            type="secondary"
            className="Infi-Fd_17_SixDot cls-drag-icon"
          ></Text>
        </Col>
      </Row>
    </Card>
  ));

  /* Returns draggable card element with condition values */
  const draggableCard = useCallback(
    (condition: any, isDropped: boolean) => {
      return activeId !== condition.id && !isDropped ? (
        <Draggable id={condition.id}>
          <DragCard data={condition} draggable={true}>
            {condition.name}
          </DragCard>
        </Draggable>
      ) : (
        <DragCard data={condition} draggable={true} dropped={isDropped}>
          {condition.name}
        </DragCard>
      );
    },
    [activeId, DragCard]
  );

  /* Filter functionality for conditions and actions */
  const filterConditionsHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const conditions =
        activeDragTab === `${CONDITION_DROPPABLE_ID}-tab`
          ? conditionsAndActions.conditions
          : conditionsAndActions.actions
            ? conditionsAndActions.actions
            : scoreType === "Flight"
              ? conditionsAndActions?.flightActions
              : conditionsAndActions?.paxActions;

      const filtered = conditions.filter((condition: any) => {
        return condition.name.toLowerCase().includes(value.toLowerCase());
      });

      activeDragTab === `${CONDITION_DROPPABLE_ID}-tab`
        ? setFilteredConditions(filtered)
        : setFilteredActions(filtered);
    },
    // eslint-disable-next-line
    [activeDragTab, filteredConditions, filteredActions]
  );

  /* Returns Tab body elements */
  const tabContent = (isCondition: boolean = true) => {
    const [filtered, dropped] = isCondition
      ? [filteredConditions, droppedConditions]
      : [filteredActions, droppedActions];

    return (
      // conditionsAndActions ?
      <Row gutter={20}>
        <Col>
          <Flex gap={5}>
            <Text type="secondary" className="Infi-Fd_15_Info fs-22"></Text>
            <Text type="secondary">
              {activeDragTab === "policy-action-droppable-tab"
                ? t("policy_action_description")
                : t("policy_condition_description")}
            </Text>
          </Flex>
        </Col>
        <Col>
          <Input
            placeholder={t(isCondition ? "search_condition" : "search_action")}
            onChange={filterConditionsHandler}
          ></Input>
        </Col>

        <Col className="cls-conditions mt-3">
          <Flex vertical gap={16}>
            {conditionsAndActions && Object.keys(conditionsAndActions)?.length
              ? filtered?.map((filteredCondition: any) => {
                  const isDropped = dropped?.some(
                    (droppedCondition) =>
                      droppedCondition?.key === filteredCondition?.key
                  );
                  return draggableCard(filteredCondition, isDropped);
                })
              : null}
          </Flex>
        </Col>
      </Row>
      // : []
    );
  };

  /* Droppable component */
  const dragAndDropHere = useCallback(
    (id: string, description: string) => {
      return (
        <Droppable
          id={id}
          droppableClass={"cls-droppable-highlight"}
          nonDroppableClass={"cls-nondroppable-hightlight"}
          draggedOver={activeDragTab.split("-tab")[0]}
        >
          {/* Adding hightlight on dragged over droppable element */}
          <Card className={`cls-drag-and-drop-card p-0`}>
            <Flex vertical align="center">
              <Text
                type="secondary"
                className="text-center Infi-Fd_28_DragDrop fs-40"
              ></Text>
              <Text type="secondary" className={`${isSmallScreen ? "fs-14" : "fs-18"}`}>
                {t(description)}
              </Text>
            </Flex>
          </Card>
        </Droppable>
      );
    },
    // eslint-disable-next-line
    [activeDragTab]
  );

  /* Tab items */
  const items: TabsProps["items"] = [
    {
      key: `${CONDITION_DROPPABLE_ID}-tab`,
      label: t(CONDITION_FORM_KEY),
      children: tabContent(),
    },
    {
      key: `${ACTION_DROPPABLE_ID}-tab`,
      label: displayActions ? (
        t(ACTIONS_FORM_KEY)
      ) : (
        <Tooltip title="Add conditions to enable 'Actions'">
          {t(ACTIONS_FORM_KEY)}
        </Tooltip>
      ),
      children: tabContent(false),
      disabled: !displayActions,
    },
  ];

  /* Returns triggers */
  const getCriteria = useCallback(
    (value: any) => {
      const trigger = conditionsAndActions?.trigger?.filter(
        (trigger: any) => trigger.id === value
      );
      trigger?.length && setCriteria(trigger?.at(0).criteria);
    },
    [conditionsAndActions?.trigger]
  );

  /* Prepares and returns respective operations for the conditions dynamically*/
  const getOperations = useCallback((field: any) => {
    const OPERATION_TYPE_MAPS: any = {
      string: ["=", "!="],
      number: ["=", "!=", ">=", ">", "<", "<=", "+/-"],
    };
    return (
      <Select
        options={OPERATION_TYPE_MAPS?.[field.type]?.map(
          (operation: string) => ({
            value: operation,
            label: operation,
          })
        )}
        size="large"
      ></Select>
    );
  }, []);

  /* Opens confirm popup */
  const openConfirmPopup: FormProps<any>["onFinish"] = useCallback(
    (values: any) => {
      setPopupData({
        ...popupData,
        modalToggle: true,
        type: "confirm",
        description: t(
          SeditPolicy
            ? "update_policy_modal_description"
            : "create_policy_modal_description",
          {
            policy_name: values.policyName,
          }
        ),
      });

      /* Saving form values */
      setPolicyFormValues(values);
    },
    [popupData, t]
  );

  /* Processess and saves submitted form values */
  const savePolicyHandler = useCallback(async () => {
    const userDetail: any = hydrateUserFromLocalStorage();
    const postData = {
      ...(isCurrentPathEqual("editScorePolicy") ? { id: SeditPolicy.id } : {}),
      ...(isScorePolicyPath
        ? {
            flightActions: policyFormValues.flightActions || {},
            paxActions: policyFormValues.paxActions || {},
            actions: policyFormValues.actions || {},
          }
        : { actions: policyFormValues.actions || {} }),
      trigger: Number(policyFormValues.trigger),
      policyName: policyFormValues.policyName,
      effectiveDate: getDynamicDate(policyFormValues.effectiveDate, true),
      discontinueDate: getDynamicDate(policyFormValues.discontinueDate, true),
      createdBy: userDetail.name,
      createdOn: SeditPolicy?.created_on
        ? SeditPolicy?.created_on
        : getDynamicDate(dayjs().format(DATE_PICKER_FORMAT), true),
      createdAt: SeditPolicy?.created_at
        ? SeditPolicy?.created_at
        : dayjs().format(DATE_TIME_FORMAT),
      lastUpdatedBy: userDetail.name,
      lastUpdatedOn: getDynamicDate(dayjs().format(DATE_PICKER_FORMAT), true),
      lastUpdatedAt: dayjs().format(DATE_TIME_FORMAT),
      priority: Number(policyFormValues.priority)
        ? Number(policyFormValues.priority)
        : 1,
      status: policyFormValues.status ? "Active" : "Inactive",
      conditions: policyFormValues.conditions,
      triggerCriteria: Number(policyFormValues.triggerCriteria)
        ? Number(policyFormValues.triggerCriteria)
        : 1,
      ...(isScorePolicyPath ? { scoreType: scoreType } : {}),
    };

    const apiCall = SeditPolicy
      ? isScorePolicyPath
        ? updateScore({ putData: postData })
        : isAutoReaccommodation
          ? updateAutoReassignPolicy({
              policyId: SeditPolicy.id,
              putData: postData,
            })
          : updatePolicy({ policyId: SeditPolicy.id, putData: postData })
      : isScorePolicyPath
        ? createScore({ policy: postData })
        : isAutoReaccommodation
          ? createAutoReassignPolicy({ policy: postData })
          : createPolicy({ policy: postData });

    apiCall
      .then((response: any) => {
        if (response?.data?.responseCode === 0) {
          /* Resetting form items after submission */
          const message = SeditPolicy
            ? isScorePolicyPath
              ? "Score updated successfully"
              : t("policy_updated_successfully")
            : isScorePolicyPath
              ? "Score created successfully"
              : t("policy_created_successfully");

          dispatch(updateReloadPolicyList());
          /* Resetting form items after submission */
          createPolicyForm.resetFields();
          setDroppedConditions([]);
          setDroppedActions([]);
          setDisplayActions(false);
          dispatch(
            updateMessageApi({
              open: true,
              type: "success",
              title: t("success"),
              description: message,
            })
          );
          redirect(
            isScorePolicyPath
              ? "scoreList"
              : isAutoReaccommodation
                ? "autoReaccommodationPolicyList"
                : "policy"
          );
        } else {
          messageApi.error(t("internal_server_error"));
        }
      })
      .catch((error) => {
        messageApi.error(t("internal_server_error")); // Handle any errors from the API call
      });
  }, [createPolicy, createPolicyForm, messageApi, policyFormValues]);

  const breadcrumbProps = [
    {
      path: isScorePolicyPath
        ? "scoreList"
        : isAutoReaccommodation
          ? "autoReaccommodationPolicyList"
          : "policy",
      title: isScorePolicyPath
        ? "Score list"
        : isAutoReaccommodation
          ? t("auto_reaccommodation_policy_list")
          : t("policy_list"),
      breadcrumbName: "Policy",
      key: "Rules & Policy",
    },
    {
      path: currentPath,
      title: isScorePolicyPath ? "Create score policy" : t("create_policy"),
      breadcrumbName: "createPolicy",
      key: "createPolicy",
    },
  ];

  /* This element is show when no conditions or actions are added */
  const noDataElement = (isCondition: Boolean = true) => {
    return (
      <Row className="cls-no-data-to-show">
        <Col span={24}>
          <Text type="danger">
            {`${isCondition ? "Conditions" : "Actions"} are not added yet !`}
          </Text>
        </Col>
      </Row>
    );
  };

  /* Handler to get data from confirm popup */
  const popupHandler = useCallback(
    (data: any) => {
      setPopupData({ ...popupData, modalToggle: false });

      /* Submitting form on confirmation */
      if (data) savePolicyHandler();
    },
    [popupData, savePolicyHandler]
  );

  /* Remove condition / Action button */
  const getRemoveConditionBtn = (
    removeHandler: (name: number) => void,
    condition: any,
    fields: any[],
    fieldName: number,
    // index: number,
    isCondition: boolean = true
  ) => (
    <Text
      type="danger"
      onClick={() => {
        if (fields?.length == 1) {
          const updateHandler = isCondition
            ? setDroppedConditions
            : setDroppedActions;

          updateHandler((prevState) => [
            ...prevState.filter((state) => {
              return state?.key !== condition?.key;
            }),
          ]);
        }
        /* Removes form item */
        removeHandler(fieldName);
      }}
      className="Infi-Fd_31_ThinCloseIcon cls-btn-icon cls-remove-icon fs-22"
    ></Text>
  );

  const [initialFormValues, setInitialFormValues] = useState(
    createPolicyForm.getFieldsValue()
  );

  /* Set initial edit policy form values to detect the changes done by the user */
  useEffect(() => {
    if (SeditPolicy) setInitialFormValues(createPolicyForm.getFieldsValue());
  }, [
    createPolicyForm,
    SeditPolicy,
    droppedConditions,
    droppedConditions,
    conditionsAndActions,
  ]);

  /* Compare the current form values with initial values */
  const onValuesChange = (changedValues: any) => {
    setIsValuesChanged(deepCompare(initialFormValues, changedValues));
  };

  /* This is a temp funcitionality to show 'Email template' select component on selecting 'email' from notification section */
  const [isEmailSelected, setIsEmailSelected] = useState<boolean>(false);
  const emailSelectionHandler = (value: any, key: string) => {
    if (key == "notification") setIsEmailSelected(value === "email");
  };

  /* Returns dynamically generated condition & action inputs */
  const getDynamicConditionFields = useCallback(
    (droppedCondition: any, field: any, formField: any): React.ReactNode => {
      const getComponent = (fieldType: string): React.ReactNode => {
        switch (fieldType) {
          case "select":
            return (
              <Form.Item
                {...formField}
                name={[formField.name, field.key]}
                rules={[{ required: true, message: "" }]}
                style={{
                  /* This is a temp funcitionality to show 'Email template' select component on selecting 'email' from notification section */
                  display:
                    field.key != "mailerTemplates" ||
                    (field.key == "mailerTemplates" && isEmailSelected)
                      ? "block"
                      : "none",
                }}
                // initialValue={field.value}
              >
                <Select
                  placeholder={field?.placeholder}
                  options={field.options.map((option: any) => ({
                    value: option.key,
                    label: option.name,
                  }))}
                  size="large"
                  onChange={(val: string) =>
                    emailSelectionHandler(val, field.key)
                  }
                />
              </Form.Item>
            );
          case "inputDropdown":
            return (
              <Space.Compact>
                <Form.Item
                  {...formField}
                  name={[formField.name, field.key, "input"]}
                  // style={{ width: "80%" }}
                  className={`w-30`}
                  rules={[{ required: true, message: "" }]}
                >
                  <Input
                    placeholder={"Enter"}
                    className="cls-condition-input-select"
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  {...formField}
                  name={[formField.name, field.key, "dropdown"]}
                  rules={[{ required: true, message: "" }]}
                  key={"dropdown"}
                  style={{ width: "100%" }}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={field.options?.map((option: any) => ({
                      value: option.key,
                      label: option.name,
                    }))}
                    placeholder={"Select"}
                    size="large"
                    dropdownRender={(menu) => (
                      <div className="cls-select">{menu}</div>
                    )}
                    placement="bottomRight"
                  />
                </Form.Item>
              </Space.Compact>
            );
          case "input":
            return (
              <Form.Item
                {...formField}
                name={[formField.name, field.key]}
                rules={[{ required: true, message: "" }]}
                initialValue={field.inputValue}
              >
                <Input
                  size="large"
                  placeholder={"Enter"}
                  disabled={field?.disabled ?? false}
                />
              </Form.Item>
            );
          default:
            return null; // Handle unknown field types
        }
      };

      return getComponent(field.field);
    },
    [isEmailSelected]
  );

  let toastrPropsData: ToastrProps["data"] = {
    title: `Error Message`,
    description: `Kindly type in this format only +1.0 or -1.0 in between -5.0 to +5.0..`,
    position: "topRight",
    type: "error",
    top: 100,
    right: 100,
    duration: 5,
    className: "cls-score-toastr",
  };

  interface ToastrComponent {
    childFunction(): void;
  }

  const childRef = useRef<ToastrComponent>(null);

  // Call the function in the child component directly from the parent
  const callChildFunction = () => {
    if (childRef.current) {
      childRef.current.childFunction();
    }
  };

  // Function to handle input change
  const inputValidation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue =
      (e.target as HTMLInputElement).value + e.key.replace(/[^0-9+-.]/g, "");
    const isFunctionalKey =
      /^(Delete|Backspace|Shift|Tab|Home|End|Ctrl|Alt|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)$/;
    var length = inputValue?.length;
    var isRequiredText = /^[0-9+-.]$/;
    var isText, status;

    switch (length) {
      case 1:
        isText = /^[+-]$/;
        break;
      case 2:
        isText = /^[+-]?[0-5]$/;
        break;
      case 3:
        isText = /^[+-]?[0-5]?[.]$/;
        break;
      case 4:
        isText =
          (e.target as HTMLInputElement).value === "+5." ||
          (e.target as HTMLInputElement).value === "-5."
            ? /^[+-]?[0-5]?[.]?[0]$/
            : /^[+-]?[0-5]?[.]?[0-9]$/;
        break;
      default:
        isText = /^[0-9+-.]$/;
        break;
    }
    status = length
      ? isRequiredText.test(e.key) && isText.test(inputValue)
      : false;
    if (!status && !isFunctionalKey.test(e.key)) {
      e.preventDefault();
      // alert("Kindly type in this format only +1.0 or -1.0");
      callChildFunction();
      return;
    }
  };

  const handleAddScoreAttribute = useCallback(
    (
      actionName: any,
      operation: string
      // , length: string | number = ""
    ) => {
      var droppedActionsTemp = JSON.parse(JSON.stringify(droppedActions));
      // const droppedActionsTemp = [...droppedActions]; // shallow copy
      droppedActionsTemp.forEach((action: any, index: number) => {
        if (action?.name === actionName) {
          if (operation === "add") {
            // if (length !== "" && (Number(length) <= (index + 1))) {
            //   return false;
            // }
            let pushElement = action?.conditionRows.fields.slice(-1)[0];
            pushElement.id = pushElement.id + 1;
            pushElement.key = pushElement.key + 1;
            pushElement.name =
              pushElement.name.replace(/\d+/g, "") +
              (Number(pushElement.name.match(/\d+/)[0]) + 1);
            action?.conditionRows.fields.push(pushElement);
          } else {
            action?.conditionRows.fields.pop();
          }
        }
      });
      if (
        JSON.stringify(droppedActions) !== JSON.stringify(droppedActionsTemp)
      ) {
        setDroppedActions(droppedActionsTemp);
      }
    },
    [droppedActions]
  );

  const getDroppedConditions = useCallback(
    (isCondition: boolean = true) => {
      const droppedValues = isCondition ? droppedConditions : droppedActions;
      let actions = !isScorePolicyPath
        ? ACTIONS_FORM_KEY
        : scoreType === "Flight"
          ? "flightActions"
          : "paxActions";

      return droppedValues.map((droppedCondition: any) => {
        const droppableType = isCondition ? CONDITION_FORM_KEY : actions;
        const initialValues =
          SeditPolicy?.[droppableType]?.[droppedCondition?.key];
        let fieldIndex: any,
          fieldOptionsLength: any,
          filteredOptions: any,
          selectedValues: any;

        return (
          droppedCondition &&
          !!Object.keys(droppedCondition)?.length && (
            <Col span={24}>
              <Row key={droppedCondition.key}>
                <Col span={24}>
                  <div className="cls-condition-group">
                    <DynamicForm
                      name={[droppableType, droppedCondition.key]}
                      initialValues={initialValues || [{}]}
                    >
                      {(field, add, remove, index, fields) => {
                        return (
                          <Row
                            className="cls-condition-row cls-flex-start mb-4"
                            gutter={30}
                          >
                            <Col span={24}>
                              <Row style={{ gap: 15 }}>
                                {((isScorePolicyPath && isCondition) ||
                                  !isScorePolicyPath) && (
                                  <Col className="cls-condition-name-container" xs={24} sm={6} md={15} lg={7} xl={5}
                                  >
                                    <Text className="cls-condition-name fs-15 d-block">
                                      {droppedCondition.name}
                                    </Text>
                                  </Col>
                                )}
                                <Col 
                                xs={24} 
                                sm={!isScorePolicyPath || isCondition ? 17 : 24} 
                                md={!isScorePolicyPath || isCondition ? 24 : 24} 
                                lg={!isScorePolicyPath || isCondition ? 16 : 24} 
                                xl={!isScorePolicyPath || isCondition ? 18 : 24}>
                                  <Row
                                    align={
                                      !isScorePolicyPath || isCondition
                                        ? "middle"
                                        : "top"
                                    }
                                    style={{ gap: 15 }}
                                    className={`${!(!isScorePolicyPath || isCondition) ? "cls-score-div" : ""}`}
                                  >
                                    {isCondition && (
                                      <>
                                        <Col>
                                          <Text className={`${isSmallScreen ? "fs-14" : "fs-16"}`}>is</Text>
                                        </Col>
                                        <Col xs={6} sm={5} md={5} lg={4} xl={3}>
                                          <Form.Item
                                            {...field}
                                            name={[field.name, `operation`]}
                                            rules={[
                                              { required: true, message: "" },
                                            ]}
                                          >
                                            {getOperations(droppedCondition)}
                                          </Form.Item>
                                        </Col>
                                      </>
                                    )}
                                    {!isScorePolicyPath || isCondition ? (
                                      droppedCondition?.conditionRows?.fields?.map(
                                        (
                                          Conditionfield: any,
                                          index: number
                                        ) => {
                                          /* This is a temp funcitionality to show 'Email template' select component on selecting 'email' from notification section */
                                          return Conditionfield.key !=
                                            "mailerTemplates" ||
                                            (Conditionfield.key ==
                                              "mailerTemplates" &&
                                              isEmailSelected) ? (
                                            <Col xs={16} sm={10} md={13} lg={12} xl={6} key={index}>
                                              {getDynamicConditionFields(
                                                droppedCondition,
                                                Conditionfield,
                                                field
                                              )}
                                            </Col>
                                          ) : (
                                            <></>
                                          );
                                        }
                                      )
                                    ) : (
                                      <>
                                        <Col xs={24} sm={9} md={24} lg={24} xl={6}>
                                          <Space.Compact
                                            size="middle"
                                            className="cls-scoretype"
                                          >
                                            <Form.Item
                                              {...field}
                                              name={[
                                                field.name,
                                                droppedCondition.key,
                                              ]}
                                              rules={[
                                                { required: true, message: "" },
                                              ]}
                                            >
                                              <Input
                                                key={droppedCondition.name}
                                                addonBefore={
                                                  <Text className="cls-condition-name fs-15">
                                                    {droppedCondition.name}
                                                  </Text>
                                                }
                                                placeholder="Score"
                                                variant="borderless"
                                                maxLength={4}
                                                onKeyDown={(e) =>
                                                  inputValidation(e)
                                                }
                                              />
                                            </Form.Item>
                                          </Space.Compact>
                                        </Col>
                                        <Col xs={20} sm={19} md={20} lg={20} xl={10}>
                                          <Flex wrap gap={15} align="center">
                                            {!isCondition &&
                                              droppedCondition?.conditionRows?.fields?.map(
                                                (
                                                  scoreData: any,
                                                  selectIndex: number
                                                ) => {
                                                  fieldIndex = selectIndex;
                                                  fieldOptionsLength =
                                                    scoreData?.options?.length;
                                                  // Get selected values for the specific action from the form
                                                  selectedValues =
                                                    createPolicyForm?.getFieldValue(
                                                      actions
                                                    )?.[droppedCondition.key][0]
                                                      ?.attributes;

                                                  // Filter the options to exclude already selected ones
                                                  filteredOptions =
                                                    scoreData?.options?.filter(
                                                      (option: any) =>
                                                        !selectedValues?.includes(
                                                          option?.value
                                                        )
                                                    );

                                                  return (
                                                    <Space.Compact
                                                      key={selectIndex}
                                                      className="cls-select-input"
                                                    >
                                                      <Form.Item
                                                        {...field}
                                                        name={[
                                                          field.name,
                                                          `attributes`,
                                                          selectIndex,
                                                        ]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message: "",
                                                          },
                                                        ]}
                                                      >
                                                        <Select
                                                          size="middle"
                                                          placeholder="Select"
                                                          // options={scoreData.options}
                                                          // options={filteredOptions}
                                                          options={filteredOptions?.map(
                                                            (option: any) => ({
                                                              value: option.key,
                                                              label:
                                                                option.name,
                                                            })
                                                          )}
                                                        />
                                                      </Form.Item>
                                                      <Form.Item
                                                        {...field}
                                                        name={[
                                                          field.name,
                                                          `attributesInput`,
                                                          selectIndex,
                                                        ]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message: "",
                                                          },
                                                        ]}
                                                      >
                                                        <Input
                                                          placeholder="Score"
                                                          className="cls-type-input"
                                                          onKeyDown={(e) =>
                                                            inputValidation(e)
                                                          }
                                                        />
                                                      </Form.Item>
                                                    </Space.Compact>
                                                  );
                                                }
                                              )}
                                            <Tooltip
                                              className="cls-cursor-pointer"
                                              title="Add score attribute"
                                            >
                                              <Text
                                                className={`fs-12 f-med underline p-clr cls-reset-icon ${fieldOptionsLength === fieldIndex + 1 ? "cls-disabled no-events" : ""}`}
                                                onClick={() =>
                                                  handleAddScoreAttribute(
                                                    droppedCondition?.name,
                                                    "add"
                                                  )
                                                }
                                              >
                                                Add
                                              </Text>
                                            </Tooltip>
                                            <Tooltip
                                              className="cls-cursor-pointer"
                                              title="Delete score attribute"
                                            >
                                              <Text
                                                className={`fs-12 f-med underline p-clr cls-reset-icon ${fieldIndex === 0 ? "cls-disabled no-events" : ""}`}
                                                onClick={() => {
                                                  // Clear values for both the Select and Input fields
                                                  const currentFieldValues =
                                                    createPolicyForm.getFieldValue(
                                                      actions
                                                    )?.[droppedCondition.key];
                                                  if (currentFieldValues) {
                                                    const updatedAttributes =
                                                      currentFieldValues?.[0]?.attributes?.filter(
                                                        (
                                                          _: any,
                                                          index: number
                                                        ) =>
                                                          index !==
                                                          selectedValues?.length -
                                                            1
                                                      );
                                                    const updatedAttributesInput =
                                                      currentFieldValues[0].attributesInput?.filter(
                                                        (
                                                          _: any,
                                                          index: number
                                                        ) =>
                                                          index !==
                                                          selectedValues?.length -
                                                            1
                                                      );
                                                    createPolicyForm.setFieldsValue(
                                                      {
                                                        [actions]: {
                                                          ...createPolicyForm.getFieldValue(
                                                            actions
                                                          ),
                                                          [droppedCondition.key]:
                                                            [
                                                              {
                                                                attributes:
                                                                  updatedAttributes,
                                                                attributesInput:
                                                                  updatedAttributesInput,
                                                              },
                                                            ],
                                                        },
                                                      }
                                                    );
                                                  }
                                                  // Optionally call the handler if necessary
                                                  handleAddScoreAttribute(
                                                    droppedCondition?.name,
                                                    "delete"
                                                  );
                                                }}
                                                type="danger"
                                              >
                                                Remove
                                              </Text>
                                            </Tooltip>
                                          </Flex>
                                        </Col>
                                      </>
                                    )}
                                    {/* {!isScorePolicyPath || isCondition && */}
                                    <Col
                                      style={{
                                        marginTop:
                                          !isScorePolicyPath || isCondition
                                            ? 1
                                            : 10,
                                      }}
                                    >
                                      <Flex gap={12}>
                                        {!droppedCondition?.isFixed &&
                                          getRemoveConditionBtn(
                                            remove,
                                            droppedCondition,
                                            fields,
                                            field.name,
                                            isCondition
                                          )}
                                        {(!isScorePolicyPath || isCondition) &&
                                          index == fields?.length - 1 &&
                                          droppedCondition?.isCloneable && (
                                            <Text
                                              className="Infi-Fd_30_Plus fs-22 cls-btn-icon cls-add-icon"
                                              onClick={() => add(field.name)}
                                            ></Text>
                                          )}
                                      </Flex>
                                    </Col>
                                    {/* } */}
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        );
                      }}
                    </DynamicForm>
                  </div>
                </Col>
              </Row>
            </Col>
          )
        );
      });
    },
    [
      SeditPolicy,
      droppedConditions,
      droppedActions,
      formWatch,
      getDynamicConditionFields,
      getOperations,
    ]
  );

  useEffect(() => {
    if (isScorePolicyPath) {
      const actions = scoreType === "Flight" ? "flightActions" : "paxActions";
      const droppedActionsTemp = JSON.parse(JSON.stringify(droppedActions));
      droppedActionsTemp?.forEach((droppedCondition: any) => {
        const getAttr =
          createPolicyForm?.getFieldValue(actions)?.[droppedCondition.key]?.[0];
        if (!getAttr) return;

        const { attributes } = getAttr;
        if (
          droppedCondition?.conditionRows?.fields?.length < attributes?.length
        ) {
          const pushElement = {
            ...droppedCondition?.conditionRows?.fields?.slice(-1)[0],
          };
          pushElement.id += 1;
          pushElement.key += 1;
          pushElement.name =
            pushElement?.name?.replace(/\d+/g, "") +
            (Number(pushElement?.name?.match(/\d+/)[0]) + 1);
          droppedCondition?.conditionRows?.fields?.push(pushElement);
        }
      });
      if (
        JSON.stringify(droppedActions) !== JSON.stringify(droppedActionsTemp)
      ) {
        setDroppedActions(droppedActionsTemp || []);
      }
    }
  }, [initialFormValues]);

  return conditionsAndActions ? (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Row className="cls-create-policy-container">
        <Col span={24} className="cls-conditions-panel">
          <Card>
            <Tabs
              defaultActiveKey={activeDragTab}
              activeKey={activeDragTab}
              centered
              items={items}
              onChange={(activeKey: string) => setActiveDragTab(activeKey)}
            />
          </Card>
        </Col>
        <Col className="cls-policy-panel">
          <Form
            form={createPolicyForm}
            onValuesChange={onValuesChange}
            name="createPolicy"
            layout="vertical"
            onFinish={openConfirmPopup}
            requiredMark={false}
            initialValues={{ items: [{}] }}
          >
            <Row>
              {/* Breadcrumb part */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-2">
                <BreadcrumbComponent
                  key={"createPolicy-breadcrumb"}
                  props={breadcrumbProps}
                />
              </Col>
              {/* Policy basic details part */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className={`${isSmallScreen ? "mb-2" :"mb-10"}`}>
                <Col span={24}>
                  <Row gutter={30} className="rg-10">
                    <Col xs={24} sm={12} md={12} lg={12} xl={7}>
                      <Form.Item
                        label={[
                          <Text className={`${isSmallScreen ? "fs-13" :"fs-14"} cls-input-label f-reg`}>
                            {t("policy_name")}
                          </Text>,
                        ]}
                        name="policyName"
                        rules={[{ required: true, message: "" }]}
                        initialValue={SeditPolicy?.policyName}
                      >
                        <Input
                          size="large"
                          placeholder={t("enter_policy_name")}
                          defaultValue={SeditPolicy?.policyName}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={5}>
                      <Form.Item
                        label={[
                          <Text className={`${isSmallScreen ? "fs-13" :"fs-14"} f-reg cls-input-label`}>
                            {t("effective_date")}
                          </Text>,
                        ]}
                        name="effectiveDate"
                        rules={[{ required: true, message: "" }]}
                        initialValue={
                          SeditPolicy?.effectiveDate
                            ? dayjs(getDynamicDate(SeditPolicy?.effectiveDate))
                            : null
                        }
                      >
                        <DatePicker
                          size="large"
                          inputReadOnly={true}
                          disabledDate={(current) =>
                            current && current < dayjs().endOf("day")
                          }
                          format={DATE_PICKER_FORMAT}
                          defaultValue={
                            SeditPolicy?.effectiveDate
                              ? dayjs(
                                  getDynamicDate(SeditPolicy?.effectiveDate)
                                )
                              : null
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={5}>
                      <Form.Item
                        label={[
                          <Text className={`${isSmallScreen ? "fs-13" :"fs-14"} f-reg cls-input-label`}>
                            {t("discontinue_date")}
                          </Text>,
                        ]}
                        name="discontinueDate"
                        rules={[{ required: true, message: "" }]}
                        initialValue={
                          SeditPolicy?.discontinueDate
                            ? dayjs(
                                getDynamicDate(SeditPolicy?.discontinueDate)
                              )
                            : null
                        }
                      >
                        <DatePicker
                          size="large"
                          inputReadOnly={true}
                          disabledDate={(current) =>
                            current && current < dayjs().endOf("day")
                          }
                          format={DATE_PICKER_FORMAT}
                          defaultValue={
                            SeditPolicy?.discontinueDate
                              ? dayjs(
                                  getDynamicDate(SeditPolicy?.discontinueDate)
                                )
                              : null
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={12} md={12} lg={12} xl={3} >
                      <Form.Item
                        label={[
                          <Text className={`${isSmallScreen ? "fs-13" :"fs-14"} f-reg cls-input-label`}>
                            {t("priority")}
                          </Text>,
                        ]}
                        name="priority"
                        rules={[{ required: true, message: "" }]}
                        initialValue={
                          SeditPolicy?.priority ? SeditPolicy?.priority : 10
                        }
                      >
                        <InputNumber
                          size="large"
                          min={1}
                          maxLength={2}
                          style={{ maxWidth: "50px" }}
                          type="number"
                          defaultValue={
                            SeditPolicy?.priority ? SeditPolicy?.priority : 10
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={14} sm={12} md={12} lg={12} xl={24} className="cls-enabled-container">
                      <Form.Item name="status" initialValue={isEnabled}>
                        <Switch
                          defaultChecked
                          checked={isEnabled}
                          onChange={() => setIsEnabled(!isEnabled)}
                        />
                      </Form.Item>
                      <Text className={`${isSmallScreen ? "fs-13" :"fs-14"}`}>{t(isEnabled ? "enabled" : "disabled")}</Text>
                    </Col>
                  </Row>
                </Col>
              </Col>
              {/* When part */}
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-5">
                  <Card>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Text className={`${isSmallScreen ? "fs-20" :"fs-24"}`}>{t("when")}</Text>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Flex align="center" gap={5}>
                          <Text
                            type="secondary"
                            className="Infi-Fd_15_Info fs-22"
                          ></Text>
                          <Text className={`${isSmallScreen ? "fs-14" :"fs-16"}`} type="secondary">
                            {t("when_description")}
                          </Text>
                        </Flex>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-3">
                        <Row className="rg-10" gutter={15}>
                          <Col xs={24} sm={12} md={16} lg={8} xl={6}>
                            <Form.Item
                              name="trigger"
                              rules={[{ required: true, message: "" }]}
                              initialValue={SeditPolicy?.trigger || 1}
                            >
                              <Select
                                size="large"
                                allowClear
                                disabled={
                                  isScorePolicyPath && !!droppedActions?.length
                                }
                                placeholder={t("select_trigger")}
                                onChange={(value, data: any) => {
                                  // getCriteria(value);
                                  setScoreType(data?.label);
                                  if (data === undefined && isScorePolicyPath) {
                                    setFilteredActions([]);
                                  }
                                }}
                                defaultValue={1}
                                options={conditionsAndActions?.trigger?.map(
                                  (trigger: any) => {
                                    return {
                                      value: trigger.id,
                                      label: trigger.name,
                                    };
                                  }
                                )}
                              />
                            </Form.Item>
                          </Col>
                          {!isScorePolicyPath && (
                            <Col xs={24} sm={12} md={16} lg={8} xl={6}>
                              <Form.Item
                                name="triggerCriteria"
                                rules={[
                                  { required: !!criteria?.length, message: "" },
                                ]}
                                initialValue={SeditPolicy?.triggerCriteria}
                              >
                                <Select
                                  size="large"
                                  className={`${!criteria?.length && !SeditPolicy?.trigger && "cls-hidden"}`}
                                  placeholder="Select criteria"
                                  options={criteria.map((criteria: any) => {
                                    return {
                                      value: criteria.id,
                                      label: criteria.name,
                                    };
                                  })}
                                />
                              </Form.Item>
                            </Col>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              {/* If then part */}
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card className="cls-if-card">
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <Row className="cls-if-container">
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Text className={`${isSmallScreen ? "fs-20" :"fs-24"}`}>{t("if")}</Text>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-4">
                              <Flex align="center" gap={5}>
                                <Text
                                  type="secondary"
                                  className="Infi-Fd_15_Info fs-22"
                                ></Text>
                                <Text className={`${isSmallScreen ? "fs-14" :"fs-16"}`} type="secondary">
                                  {t("if_description")}
                                </Text>
                              </Flex>
                            </Col>
                            {!!droppedConditions?.length && (
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Row className="cls-dropped-conditions">
                                  {getDroppedConditions()}
                                </Row>
                              </Col>
                            )}
                            {activeDragTab ===
                            `${CONDITION_DROPPABLE_ID}-tab` ? (
                              <Col span={24}>
                                {dragAndDropHere(
                                  CONDITION_DROPPABLE_ID,
                                  "dnd_condition_here"
                                )}
                              </Col>
                            ) : !droppedConditions?.length ? (
                              <Col span={24}> {noDataElement()}</Col>
                            ) : (
                              <></>
                            )}
                          </Row>
                        </Col>
                        {displayActions ? (
                          <Col span={24} className="mt-4">
                            <Row className="cls-then-container">
                              <Col span={24}>
                                <Text className={`${isSmallScreen ? "fs-20" :"fs-24"}`}>{t("then")}</Text>
                              </Col>
                              <Col span={24} className="mb-4">
                                <Flex align="center">
                                  <Text
                                    type="secondary"
                                    className="Infi-Fd_15_Info fs-22"
                                  ></Text>
                                  <Text className={`${isSmallScreen ? "fs-14" :"fs-16"}`} type="secondary">
                                    {t("then_description")}
                                  </Text>
                                </Flex>
                              </Col>
                              {!!droppedActions?.length &&
                                getDroppedConditions(false)}
                              {activeDragTab ===
                              `${ACTION_DROPPABLE_ID}-tab` ? (
                                <Col span={24}>
                                  {dragAndDropHere(
                                    ACTION_DROPPABLE_ID,
                                    "dnd_action_here"
                                  )}
                                </Col>
                              ) : !droppedActions?.length ? (
                                <Col span={24}> {noDataElement(false)}</Col>
                              ) : (
                                <></>
                              )}
                            </Row>
                          </Col>
                        ) : (
                          <Col span={24} className="mt-5">
                            <Flex align="center" justify="center">
                              <Button
                                type="primary"
                                onClick={() => {
                                  setDisplayActions(true);
                                  setActiveDragTab(
                                    `${ACTION_DROPPABLE_ID}-tab`
                                  );
                                }}
                                htmlType="button"
                                disabled={
                                  !droppedConditions.filter(
                                    (condition) => condition
                                  )?.length
                                }
                              >
                                {t("add_action")}
                              </Button>
                              <Button type="link" htmlType="button">
                                {t("reset")}
                              </Button>
                            </Flex>
                          </Col>
                        )}
                      </Row>
                    </Card>
                  </Col>
                  {/*Policy saving part*/}
                  <Col span={24} className="mt-5">
                    <Row justify="end">
                      <Col>
                        <Flex gap={20}>
                          <Button
                            type="default"
                            className="fs-18 px-4"
                            htmlType="button"
                            onClick={() => redirect("policy")}
                          >
                            {t("cancel")}
                          </Button>
                          <Form.Item>
                            <SubmitButton
                              form={createPolicyForm}
                              customValidation={
                                !!(
                                  droppedConditions?.length &&
                                  droppedActions?.length &&
                                  (SeditPolicy ? isValuesChanged : true)
                                )
                              }
                              htmlType="submit"
                            >
                              {t("save_policy")}
                            </SubmitButton>
                          </Form.Item>
                        </Flex>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Toastr data={toastrPropsData} ref={childRef} />
      <DragOverlay modifiers={[restrictToWindowEdges]} dropAnimation={null}>
        {activeId ? (
          <Draggable id={activeId}>
            <DragCard key={activeId} data={activeDragData}>
              {activeDragData?.name}
            </DragCard>
          </Draggable>
        ) : null}
      </DragOverlay>
      {/* Message API context */}
      {contextHolder}
      <ConfirmModalPopup onData={popupHandler} props={popupData} />
    </DndContext>
  ) : (
    <CreatePolicySkeleton />
  );
};

export default CreatePolicy;
