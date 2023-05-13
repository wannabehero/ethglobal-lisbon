import { CheckCircleOutlined } from "@ant-design/icons";
import { SismoConnect } from "@sismo-core/sismo-connect-client";
import { Tag, Button } from "antd";
import { SISMO_CLAIM, SISMO_CONFIG } from "../ClaimHelperCard/consts";

export default function SismoConnectBody({ verified }: { verified: boolean }) {
    const onSismoProofRequest = async () => {
        // create a new SismoConnect instance with the client configuration
        const sismoConnect = SismoConnect(SISMO_CONFIG);
        localStorage.setItem('sismo-connect', '');
        // The `request` function sends your user to the Sismo Vault App
        // to generate the proof of group membership
        // After the proof generation, the user is redirected with it to your app
        sismoConnect.request({ claim: SISMO_CLAIM });
      };
      
    return (
        <>
          {verified ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Noun owner! Wow!
            </Tag>
          ) : (
            <Button shape="round" onClick={onSismoProofRequest}>
              Proof Noun Ownership
            </Button>
          )}
        </>
      );
}