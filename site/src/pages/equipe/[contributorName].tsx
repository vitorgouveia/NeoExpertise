import { GetServerSideProps, NextPage } from 'next'
import { Contributor, SocialMedia } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { styled } from '@/stitches.config'
import { Heading } from '@/components/heading'
import { Button } from '@/components/button'

const Container = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  width: '100%',
  maxWidth: '1600px',
  margin: 'auto',

  gap: '$sizes$100',
  padding: '$sizes$500',
})

const UserProfile = styled('img', {
  border: '4px solid $grayLighter',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
})

const Contributor: NextPage<{
  contributor: (Contributor & { socialMedia: SocialMedia[] }) | null
}> = ({ contributor }) => {
  if (!contributor) {
    return <div>could not find shit</div>
  }

  return (
    <Container>
      <UserProfile
        src={contributor?.imgUrl}
        alt={contributor?.imgDescription}
      />

      <Heading.subtitle2>{contributor?.name}</Heading.subtitle2>
      <Heading.paragraph css={{ color: '$grayLighter' }}>
        {contributor?.description}
      </Heading.paragraph>

      {contributor.socialMedia.map(({ id, link, platformName }) => (
        <Button as="a" variant="outlined" href={link} key={id}>
          {platformName}
        </Button>
      ))}
    </Container>
  )
}

export default Contributor

export const getServerSideProps: GetServerSideProps<
  {},
  { contributorName: string }
> = async ({ params }) => {
  const { contributorName } = params!

  const contributor = await prisma.contributor.findFirst({
    where: {
      slug: contributorName,
    },
    select: {
      slug: true,
      description: true,
      imgDescription: true,
      imgUrl: true,
      name: true,
      socialMedia: true,
      socialMediaId: true,
      createdAt: false,
      updatedAt: false,
    },
  })

  if (!contributor) {
    return {
      props: {
        contributor: null,
      },
    }
  }

  return {
    props: {
      contributor,
    },
  }
}
