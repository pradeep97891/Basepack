import './CreateEmailTemplate.scss'

const CreateEmailTemplate:React.FC = () => {
    return <iframe
      data-testid = "CreateEmailTemplate"
      title="Mailer Template"
      width="100%"
      height="800px"
      src="https://mail-v2.grouprm.net/mailer/templates/new/default"
      style={{border: 0}}
    ></iframe>
}

export default CreateEmailTemplate