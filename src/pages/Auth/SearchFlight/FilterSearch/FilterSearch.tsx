import { Col, Row, Card, Button, Checkbox, Slider, Typography } from "antd";
// import './FilterSearch.scss';
const { Text } = Typography;
const FilterSearch = () => {
  const dummyData: any[] = [
    { airline: "Air Asia", status: false, count: "25" },
    { airline: "Air Vistara", status: false, count: "25" },
    { airline: "Air India", status: false, count: "25" },
    { airline: "Indigo ", status: false, count: "25" },
    { airline: "Air Asia", status: false, count: "25" },
  ];
  const stops: any[] = [
    { stop_value: "Non-Stop" },
    { stop_value: "1 stop" },
    { stop_value: "2 stop" },
    { stop_value: "3 stop" },
  ];
  return (
    <>
      <Card data-testid="filterSearch">
        <Row>
          <Col span={15} className="fs-16 f-sbold">
            Filter Search
          </Col>
          <Col span={8} offset={1}>
            <Button type="link" title="Clear All" size="small">
              Clear All
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={24} className="f-sbold">
            Stops from chennai
          </Col>
        </Row>
        <Row className="mt-3">
          {stops?.map((item) => (
            <Col span={11} className="mb-1 mr-1  mt-1 cls-stop-btn ">
              <Button size="small" block>
                {item.stop_value}
              </Button>
            </Col>
          ))}
        </Row>
        <Row className="mt-3">
          <Col span={24} className="f-sbold">
            Onward Airlines
          </Col>
        </Row>
        {dummyData?.map((item) => (
          <Row className="mt-3">
            <Col span={20}>
              {item.airline} <span>{item.count}</span>
            </Col>
            <Col span={1} offset={2}>
              <Checkbox />
            </Col>
          </Row>
        ))}

        <Row className="mt-3">
          <Col span={24} className="f-sbold">
            Price
          </Col>
          <Col span={24}>
            <Slider defaultValue={30} />
          </Col>
          <Col span={10} className="f-sbold">
            INR 4,000
          </Col>
          <Col span={12} offset={2} className="f-sbold">
            INR 50,000
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={15} className="f-sbold">
            From Duabi
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={20}>
            {" "}
            <Text className="Infi-Fd_67_Before6AM"></Text>
            Before 6AM{" "}
          </Col>
          <Col span={2} offset={2}>
            <Checkbox />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={20}>
            <Text className="Infi-Fd_68_MorningIcon"></Text>
            6AM-12 Noon
          </Col>
          <Col span={2} offset={2}>
            <Checkbox />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={20}>
            {" "}
            <Text className="Infi-Fd_69_NoonIcon"></Text>
            12 Noon-6PM{" "}
          </Col>
          <Col span={2} offset={2}>
            <Checkbox />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col span={20}>
            {" "}
            <Text className="Infi-Fd_70_NightIcon"></Text>
            12 Noon-6PM{" "}
          </Col>
          <Col span={2} offset={2}>
            <Checkbox />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export { FilterSearch };
