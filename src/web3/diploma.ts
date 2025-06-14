import { ethers } from 'ethers';
import { getProvider, switchToAmoy, switchToLocalhost } from './web3';
import { diplomaABI, diplomaAddress } from './contract.ts';
import {
  IDataStorage,
  CredentialStorage,
  IdentityStorage,
  BrowserDataSource,
  W3CCredential,
  Identity,
  Profile,
  MerkleTreeLocalStorage,
  EthStateStorage,
  defaultEthConnectionConfig,
  LocalStoragePrivateKeyStore,
  BjjProvider,
  KmsKeyType,
  KMS,
  CredentialStatusResolverRegistry,
  CredentialStatusType,
  IssuerResolver,
  RHSResolver,
  CredentialWallet,
  IdentityWallet,
  byteEncoder,
  CredentialRequest,
} from '@0xpolygonid/js-sdk';

// Privado ID data storage and dependencies initialization

  const dataStorage: IDataStorage = {
    credential: new CredentialStorage(
      new BrowserDataSource<W3CCredential>('credential')
    ),
    identity: new IdentityStorage(
      new BrowserDataSource<Identity>('identity'),
      new BrowserDataSource<Profile>('profile')
    ),
    mt: new MerkleTreeLocalStorage(40),
    states: new EthStateStorage(defaultEthConnectionConfig),
  };

  const localStorageKeyStore = new LocalStoragePrivateKeyStore();
  const bjjProvider = new BjjProvider(
    KmsKeyType.BabyJubJub,
    localStorageKeyStore
  );
  const kms = new KMS();
  kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);

  const statusRegistry = new CredentialStatusResolverRegistry();
  statusRegistry.register(
    CredentialStatusType.SparseMerkleTreeProof,
    new IssuerResolver()
  );
  statusRegistry.register(
    CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
    new RHSResolver(dataStorage.states)
  );
  const credWallet = new CredentialWallet(dataStorage, statusRegistry);
  const wallet = new IdentityWallet(kms, dataStorage, credWallet);

export const issueCredential = async (
  studentAddress: string,
  studentName: string,
  degree: string,
  university: string
) => {
  if (import.meta.env.VITE_ENV === 'localhost') {
    await switchToLocalhost();
  } else {
    await switchToAmoy();
  }
  // const provider = getProvider();
  // const signer = await provider.getSigner();
  // const contract = new ethers.Contract(diplomaAddress, diplomaABI, signer);

  const seedPhraseIssuer: Uint8Array = byteEncoder.encode(
    'seedseedseedseedseedseedseedseed'
  );

  try {
    const { did: issuerDID } =
      await wallet.createIdentity({
        method: 'iden3',
        blockchain: 'polygon',
        networkId: 'amoy',
        seed: seedPhraseIssuer,
        revocationOpts: {
          type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
          id: 'https://rhs-staging.polygonid.me',
        },
      });

    const seedPhraseUser: Uint8Array = byteEncoder.encode(
      'userseedseedseedseedseedseeduser'
    );

    const { did: userDID } =
      await wallet.createIdentity({
        method: 'iden3',
        blockchain: 'polygon',
        networkId: 'amoy',
        seed: seedPhraseUser,
        revocationOpts: {
          type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
          id: 'https://rhs-staging.polygonid.me',
        },
      });

      // const courseString = localStorage.getItem("course");
      // const userName =  localStorage.getItem("user") as string;
      // const studentWalletAddress =  localStorage.getItem("wallet") as string;
      // const course = courseString ? JSON.parse(courseString) : null;


    //   Create Credential Request (credentialRequest) and Issue Credential (issueCredential)
    const claimReq: CredentialRequest = {
      credentialSchema:
        'https://raw.githubusercontent.com/crj-roadr/blockchain-iscte/refs/heads/main/credential-schema/EducationalInstitutionStudentCredential.json',
      type: 'StudentCredentialAuthenticationType',
      // credentialSubject: {
      //     id: userDID.toString(),
      //     birthday: 19960424,
      //     documentType: 99,
      // },
      credentialSubject: {
        id: userDID.string(),
        studentAddress,
        studentName,
        degree,
        university,
      },
      expiration: 12345678888,
      revocationOpts: {
        type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
        id: 'https://rhs-staging.polygonid.me',
      },
    };
    console.log("=====================Credential Subject=====================");
    console.log(`id: ${userDID.string()}, studentAddress: ${studentAddress}, studentName: ${studentName}, degree: ${degree}, university: ${university}`);
    console.log("=====================Calling issueCredential=====================");
    const issuerCred = await wallet.issueCredential(issuerDID, claimReq);

    console.log("Issued Credential", issuerCred);

    // const tx = await contract.issueCredential(
    //   studentAddress,
    //   studentName,
    //   degree,
    //   university
    // );
    // await tx.wait();
    alert('Credential issued successfully!');
    return issuerCred;
  } catch (error) {
    console.error('Error issuing credential:', error);
    alert('Failed to issue credential!');
  }
};

export const getCredential = async (credentialId: string) => {
  if (import.meta.env.VITE_ENV === 'localhost') {
    await switchToLocalhost();
  } else {
    await switchToAmoy();
  }
  // const provider = getProvider();
  // const contract = new ethers.Contract(diplomaAddress, diplomaABI, provider);

  try {
    const credential = await wallet.credentialWallet.findById(credentialId);
    return credential ? credential : null;
  } catch (error) {
    console.error('Error getting credential:', error);
  }
};

export const revokeCredential = async (studentAddress: string) => {
  if (import.meta.env.VITE_ENV === 'localhost') {
    await switchToLocalhost();
  } else {
    await switchToAmoy();
  }
  const provider = getProvider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(diplomaAddress, diplomaABI, signer);

  try {
    const credential = await contract.revokeCredential(studentAddress);
    await credential.wait();
    alert('Credential was revoked');
    return true;
  } catch (error) {
    console.error('Error revoking credential:', error);
    alert('Error revoking credential!');
  }
};
